import { Connection } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * Import static data from .yml file into database entities
 * locate files into src/db/*.yml
 *
 * IF A TABLE IS NOT EMPTY WILL BE SKIPPED
 *
 * @param name file name .yml to import
 * @param dbConnection typeorm connection
 */
export async function loadInitDbData(
  name: string,
  dbConnection: Connection
): Promise<any> {
  let items: any[] = [];
  try {
    const file: any = yaml.safeLoad(
      fs.readFileSync(`src/db/${name}.yml`, 'utf8')
    );
    items = file['db'];
  } catch (e) {
    console.log('init db error', e);
  }

  if (!items) {
    return;
  }
  const skipEntities: any = {};
  const okEntities: any = {};

  for (let i = 0; i < items.length; i++) {
    const entityName = Object.keys(items[i])[0];
    const data = items[i][entityName];
    if (skipEntities[entityName]) continue;
    if (!okEntities[entityName]) {
      const count = await dbConnection
        .createQueryBuilder()
        .select()
        .from(entityName, entityName)
        .getCount();
      if (count > 0) {
        console.log(`skip ${entityName}`);
        skipEntities[entityName] = true;
        continue;
      } else {
        okEntities[entityName] = true;
      }
    }
    await dbConnection
      .createQueryBuilder()
      .insert()
      .into(entityName)
      .values(data)
      .execute();
    console.log(`insert ${JSON.stringify(data, null, 2)} into ${entityName}`);
  }
}
