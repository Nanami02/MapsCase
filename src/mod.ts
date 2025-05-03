import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

const secureContainers = {
    "kappa": "5c093ca986f7740a1867ab12",
    "kappa_cult": "676008db84e242067d0dc4c9",
    "gamma": "5857a8bc2459772bad15db29",
    "gamma_tue":"665ee77ccf2d642e98220bca",
    "epsilon": "59db794186f77448bc595262",
    "beta": "5857a8b324597729ab0a0e7d",
    "alpha": "544a11ac4bdc2d470e8b456a",
    "waistPouch": "5732ee6a24597719ae0c0281"
};

const itemId = "6750bcd725e72632012ce26d";

class Mod implements IPostDBLoadMod, IPostSptLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        
        const customItem = container.resolve<CustomItemService>("CustomItemService");
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();


        const mapsCase: NewItemFromCloneDetails = {
            itemTplToClone: "5783c43d2459774bbe137486",
            overrideProperties: {
                Name: "Maps case",
                ShortName: "Maps",
                Description: "Wallet for maps.",
                Prefab: {
                    "path": "assets/content/items/barter/wallet/wallet.bundle",
                    "rcid": ""
                },
                Grids: [
                    {
                        "_name": "main",
                        "_id": "5d235bb686f77443f433127a",
                        "_parent": itemId,
                        "_props": {
                            "filters": [
                                {
                                    "Filter": [
                                        "567849dd4bdc2d150f8b456e"
                                    ],
                                    "ExcludedFilter": []
                                }
                            ],
                            "cellsH": 6,
                            "cellsV": 2,
                            "minCount": 0,
                            "maxCount": 0,
                            "maxWeight": 0,
                            "isSortingTable": false
                        },
                        "_proto": "55d329c24bdc2d892f8b4567"
                    }
                ]
            },
            parentId: "5795f317245977243854e041",
            newId: itemId,
            fleaPriceRoubles: 50000,
            handbookPriceRoubles: 50000,
            handbookParentId: "5b5f6fa186f77409407a7eb7",
            locales: {
                en: {
                    name: "Maps case",
                    shortName: "Maps",
                    description: "Wallet for maps."
                }
            }
        };

        customItem.createItemFromClone(mapsCase);

        const traders = tables.traders["54cb57776803fa99248b456e"];

        traders.assort.items.push({
            "_id": itemId,
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 99999
            }
        });
        traders.assort.barter_scheme[itemId] = [
            [
                {
                    "count": 50000,
                    "_tpl": "5449016a4bdc2d6f028b456f"
                }
            ]
        ];
        traders.assort.loyal_level_items[itemId] = 1;

        this.allowMapsIntoContainers(itemId, tables.templates.items, secureContainers);
        this.allowMapsIntoContainers(itemId, tables.templates.items, ["5d235bb686f77443f4331278"]);

    }

    allowMapsIntoContainers(itemId, items, containers): void 
    {
        let currentCase = null;

        try 
        {
            for (const secureCase in containers) 
            {                
                currentCase = secureCase;
                items[containers[secureCase]]
                    ._props
                    .Grids[0]
                    ._props
                    .filters[0]
                    .Filter
                    .push(itemId)
            }
        }
        catch (error) 
        {
            // In case a mod that changes the containers does remove the 'Filter' from filters array
            items[containers[currentCase]]
                ._props
                .Grids[0]
                ._props
                .filters
                .push(
                    {"Filter": [itemId]}
                );
                
        }
    }

    public postSptLoad(container: DependencyContainer): void 
    {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;

        if (item[itemId]._props !== null) 
        {
            console.log("MapsCase has loaded.")
        }
        else 
        {
            console.log("MapsCase hasn't loaded.")
        }
    }
}

export const mod = new Mod();
