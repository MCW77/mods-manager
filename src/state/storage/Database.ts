// utils
import { defer } from "#/utils/defer";
import nothing from "#/utils/nothing";

// domain
import { BaseCharacter } from "#/domain/BaseCharacter";
import {
  CharacterTemplate,
  CharacterTemplates,
} from "#/domain/CharacterTemplates";
import { OptimizerRun } from "#/domain/OptimizerRun";
import { PlayerProfile, IFlatPlayerProfile } from "#/domain/PlayerProfile";
import { SelectedCharacters } from "#/domain/SelectedCharacters";

type DBError = DOMException | null;

type DBErrorFunc = (err: DBError) => void;
const dbErrorFunc: DBErrorFunc = (err: DBError) => {};

type DBSuccessFunc = (db: Database) => void;
const dbSuccessFunc: DBSuccessFunc = (db: Database) => {};

type DBRequestSuccessFunc = (request: IDBRequest) => void;
const dbRequestSuccessFunc: DBRequestSuccessFunc = (request: IDBRequest) => {};

type DBTransactionSuccessFunc = (transaction: IDBTransaction) => void;
const dbtransactionSuccessFunc: DBTransactionSuccessFunc = (transaction: IDBTransaction) => {};

type OpenDBError = ((this: IDBRequest<IDBDatabase>, ev: Event) => any) | null;
type OpenDBSuccess = ((this: IDBRequest<IDBDatabase>, ev: Event) => any) | null;

type DBRequestError<T> = ((this: IDBRequest<T>, ev: Event) => any) | null;
type DBRequestSuccess<T> = ((this: IDBRequest<T>, ev: Event) => any) | null;

type DBTransactionError = ((this: IDBTransaction, ev: Event) => any) | null;
type DBTransactionComplete = ((this: IDBTransaction, ev: Event) => any) | null;

export interface IUserData {
  allyCode: string;
  version: string;
  profiles: IFlatPlayerProfile[];
  gameSettings: BaseCharacter[];
  lastRuns: any;
  characterTemplates: any; // IFlatCharacterTemplate[];
}

export class Database {
  database = defer();

  dbName = 'ModsOptimizer';

  /**
   * Generate a new Database instance
   * @param onsuccess {function(Database)}
   * @param onerror {function(error)}
   */
  constructor(onsuccess: DBSuccessFunc = dbSuccessFunc, onerror: DBErrorFunc = dbErrorFunc) {
    const self = this;
    const openDbRequest = indexedDB.open(this.dbName, 2);

    openDbRequest.onerror = function (event: Event): void {
      if (event !== null && event.target instanceof IDBRequest) {
        self.database.reject(event.target.error);
        onerror(event.target.error)
      }
    };

    openDbRequest.onsuccess = function (event: Event) {
      if (event !== null && event.target instanceof IDBRequest) {
        const db = event.target.result;
        if (db instanceof IDBDatabase) {
          self.database.resolve(db);
        }

        event.target.result.onversionchange = function (event: IDBVersionChangeEvent) {
          if (!event.newVersion) {
            db.close();
          }
        };

        onsuccess(self);
      }
    };

    openDbRequest.onupgradeneeded = function (event) {
      if (event !== null && event.target instanceof IDBRequest)
      {
        const db = event.target.result;

        if (event.oldVersion < 1) {
          // Create object stores for: game data about each character, player profiles, and the last run done by each
          // player
          db.createObjectStore('gameSettings', { keyPath: 'baseID' });
          db.createObjectStore('profiles', { keyPath: 'allyCode' });
          db.createObjectStore('lastRuns', { keyPath: 'allyCode' });
        }
        if (event.oldVersion < 2) {
          db.createObjectStore('characterTemplates', { keyPath: 'name' });
        }
      }
    };
  }

  /**
   * Export all the data from the database, calling the callback with the result
   * @param onsuccess {function(Object)}
   * @param onerror {function(error)}
   */
  export(onsuccess: (ud: IUserData) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then((db: IDBDatabase) => {
      const getDataRequest = db.transaction(['gameSettings', 'profiles', 'lastRuns', 'characterTemplates']);

      const userData: IUserData = {
        allyCode: '',
        version: '',
        profiles: [],
        gameSettings: [],
        lastRuns: null,
        characterTemplates: null
      };

      getDataRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      getDataRequest.oncomplete = function () {
        onsuccess(userData);
      };

      const profilesRequest = getDataRequest.objectStore('profiles').getAll();
      profilesRequest.onsuccess = function (event: Event) {

        userData.profiles = (event.target as IDBRequest).result;
      };

      const gameSettingsRequest = getDataRequest.objectStore('gameSettings').getAll();
      gameSettingsRequest.onsuccess = function (event: Event) {
        userData.gameSettings = (event.target as IDBRequest).result;
      };

      const lastRunsRequest = getDataRequest.objectStore('lastRuns').getAll();
      lastRunsRequest.onsuccess = function (event: Event) {
        userData.lastRuns = (event.target as IDBRequest).result;
      };

      const characterTemplatesRequest = getDataRequest.objectStore('characterTemplates').getAll();
      characterTemplatesRequest.onsuccess = function (event: Event) {
        userData.characterTemplates = (event.target as IDBRequest).result;
      };
    })
  }

  /**
   * Delete everything from the database, and the database itself
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  delete(onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(() => {
      const deleteDataRequest = indexedDB.deleteDatabase(this.dbName);

      deleteDataRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      deleteDataRequest.onsuccess = function () {
        onsuccess();
      };
    });
  }

  /**
   * Delete a profile from the database
   * @param allyCode {string}
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  deleteProfile(allyCode: string, onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    const self = this;
    this.database.then(db => {
      const deleteProfileRequest = db
        .transaction('profiles', 'readwrite')
        .objectStore('profiles')
        .delete(allyCode);

      deleteProfileRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      deleteProfileRequest.onsuccess = function () {
        self.deleteLastRun(allyCode);
        onsuccess();
      };
    })
  }

  /**
   * Delete an Optimizer Run from the database
   * @param allyCode {string}
   * @param onsuccess {function()}
   * @param onerror {function(error)}
   */
  deleteLastRun(allyCode: string, onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const deleteLastRunRequest = db
        .transaction('lastRuns', 'readwrite')
        .objectStore('lastRuns')
        .delete(allyCode);

      deleteLastRunRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      deleteLastRunRequest.onsuccess = function (event) {
        onsuccess();
      };
    })
  }

  deleteCharacterTemplate(name: string, onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const deleteTemplateRequest = db
        .transaction('characterTemplates', 'readwrite')
        .objectStore('characterTemplates')
        .delete(name);

      deleteTemplateRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      deleteTemplateRequest.onsuccess = function (event) {
        onsuccess();
      };
    });
  }

  /**
   * Get all of the basecharacters from the database and return them as an object
   * @param onsuccess {function(Array<BaseCharacter>)}
   * @param onerror {function(error)}
   */
  getBaseCharacters(onsuccess: (baseCharacters: BaseCharacter[]) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const getBaseCharactersRequest =
        db
          .transaction('gameSettings', 'readwrite')
          .objectStore('gameSettings')
          .getAll();

      getBaseCharactersRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      getBaseCharactersRequest.onsuccess = function (event) {
        const baseCharacters: BaseCharacter[] = ((event.target as IDBRequest).result as BaseCharacter[]);
        onsuccess(baseCharacters);
      };
    })
  }

  /**
   * Get a single profile. If no allyCode is given, the first profile in the database will be returned.
   * @param allyCode {string}
   */
  async getProfile(allyCode: string) {

    let db = await this.database;

    if (allyCode !== '') {

      return new Promise((successCallback: (profile: PlayerProfile) => void, errorCallback: (error: DOMException | null) => void) => {
        const getProfileRequest =
        // Using a read/write transaction forces the database to finish loading profiles before reading from here
        db.transaction('profiles', 'readwrite').objectStore('profiles').get(allyCode);

      getProfileRequest.onsuccess = function (event) {
        if  (event !== null && event.target instanceof IDBRequest) {
          const profile = PlayerProfile.deserialize(event.target.result);
          successCallback(profile);
        }
      };

      getProfileRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          errorCallback(event.target.error);
      };

      })
    } else {
      return new Promise((successCallback: (profile: PlayerProfile) => void, errorCallback: (error: DOMException | null) => void) => {
        const getProfileRequest =
          db.transaction('profiles', 'readwrite').objectStore('profiles').openCursor();

        getProfileRequest.onsuccess = function (event) {
          if  (event !== null && event.target instanceof IDBRequest) {
            const cursor = event.target.result;

            if (cursor) {
              const profile = PlayerProfile.deserialize(cursor.value);
              successCallback(profile);
            } else {
              successCallback(PlayerProfile.Default);
            }
          }
        };

        getProfileRequest.onerror = function (event: Event) {
          if (event !== null && event.target instanceof IDBRequest)
            errorCallback(event.target.error);
        };
      })
    }
  }

  /**
   * Get all of the profiles from the database, where each entry is [baseID, playerName]
   * @param onsuccess {function(Array<PlayerProfile>)}
   * @param onerror {function(error)}
   */
  getProfiles(onsuccess: ((a: PlayerProfile[]) => void | typeof nothing) = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const profilesRequest =
        // Using a read/write transaction forces the database to finish loading profiles before reading from here
        db.transaction('profiles', 'readwrite').objectStore('profiles').getAll();

      profilesRequest.onsuccess = function (event) {
        if  (event !== null && event.target instanceof IDBRequest){
          const profiles = event.target.result.map(
            (profile: IFlatPlayerProfile) => PlayerProfile.deserialize(profile));
          onsuccess(profiles);
        }
      };

      profilesRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      }
    })
  }

  /**
   * Retrieve a character template from the database by name
   * @param name {string}
   * @param onsuccess {function(Object)}
   * @param onerror {function(error)}
   */
  getCharacterTemplate(name: string, onsuccess: (template: CharacterTemplate) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const templateRequest = db.transaction('characterTemplates', 'readwrite')
        .objectStore('characterTemplates').get(name);

      templateRequest.onsuccess = function (event) {
        if  (event !== null && event.target instanceof IDBRequest) {
          const template: CharacterTemplate = event.target.result;
          onsuccess(template);
        }
      };

      templateRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };
    })
  }

  /**
   * Get all of the saved character templates from the database
   * @param onsuccess {function(CharacterTemplates)}
   * @param onerror {function(error)}
   */
  getCharacterTemplates(onsuccess: (charTemplates: CharacterTemplates) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const templatesRequest =
        db.transaction('characterTemplates', 'readwrite').objectStore('characterTemplates').getAll();

      templatesRequest.onsuccess = function (event) {
        if  (event !== null && event.target instanceof IDBRequest) {
          const templates: CharacterTemplates = event.target.result;
          onsuccess(templates);
        }
      };

      templatesRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      }
    })
  }

  /**
   * Add or update a single profile in the database
   * param profile {PlayerProfile}
   * param onerror {function(error)}
   */
  saveProfile(profile: PlayerProfile | IFlatPlayerProfile, onsuccess: () => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then((db: IDBDatabase) => {
      const saveProfileTransaction = db.transaction(['profiles'], 'readwrite');
      const saveProfileRequest = saveProfileTransaction.objectStore('profiles')
        .put(profile instanceof PlayerProfile ? profile.serialize() : profile);
      let requestError: DBError = null;

      saveProfileRequest.onsuccess = function (event: Event) {
        onsuccess()
      }

      saveProfileRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          requestError = event.target.error;
      };

      saveProfileTransaction.oncomplete = function (event: Event) {
        if (requestError)
          onerror(requestError);
      };

      saveProfileTransaction.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBTransaction)
          onerror(event.target.error);
      }
    })
  }

  /**
   * Add new profiles to the database, or update existing ones
   * @param profiles {Array<PlayerProfile>}
   * @param onsuccess {function(Array<string>)}
   * @param onerror {function(error)}
   */
  saveProfiles(profiles: PlayerProfile[], onsuccess: (keys: string[]) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const saveProfileRequest = db.transaction(['profiles'], 'readwrite');
      const keys: string[] = [];

      saveProfileRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      saveProfileRequest.oncomplete = function (event) {
        onsuccess(keys);
      };

      profiles.forEach(profile => {
        const profileRequest = saveProfileRequest.objectStore('profiles').put(
          'function' === typeof profile.serialize ? profile.serialize() : profile
        );

        profileRequest.onsuccess = function (event) {
          if (event !== null && event.target instanceof IDBRequest)
            keys.push(event.target.result);
        };
      });
    })
  }

  /**
   * Add new gameSettings to the database, or update existing ones
   * @param baseCharacters {Array<BaseCharacter>}
   * @param onsuccess {function(Array<string>)}
   * @param onerror {function(error)}
   */
  saveBaseCharacters(baseCharacters: BaseCharacter[], onsuccess: (keys: string[]) => void = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const saveBaseCharactersRequest = db.transaction(['gameSettings'], 'readwrite');
      const keys: string[] = [];

      saveBaseCharactersRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      saveBaseCharactersRequest.oncomplete = function (event) {
        onsuccess(keys);
      };

      baseCharacters.forEach(baseChar => {
        const singleRequest = saveBaseCharactersRequest.objectStore('gameSettings').put(baseChar);

        singleRequest.onsuccess = function (event: Event) {
          keys.push((event.target as IDBRequest).result);
        };
      });
    })
  }

  /**
   * Save an optimizer run to the database, or update an existing one
   * @param lastRun {OptimizerRun}
   * @param onerror {function(error)}
   */
  saveLastRun(lastRun: OptimizerRun, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const saveLastRunRequest = db.transaction(['lastRuns'], 'readwrite')
        .objectStore('lastRuns')
        .put(lastRun);

      saveLastRunRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };
    })
  }

  /**
   * Save a group of last runs
   * @param lastRuns {Array<OptimizerRun>}
   * @param onerror {function(error)}
   */
  saveLastRuns(lastRuns: OptimizerRun[], onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const saveLastRunsRequest = db.transaction(['lastRuns'], 'readwrite');

      saveLastRunsRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      lastRuns.forEach(lastRun => {
        const singleRequest = saveLastRunsRequest.objectStore('lastRuns').put(lastRun);
      });
    })
  }

  saveCharacterTemplate(name: string, selectedCharacters: SelectedCharacters, onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const templateObject = {
        name: name,
        selectedCharacters: selectedCharacters.map(({ id, target }) => ({
          id: id,
          target: target
        }))
      };

      const saveTemplateRequest = db.transaction(['characterTemplates'], 'readwrite')
        .objectStore('characterTemplates')
        .put(templateObject);

      saveTemplateRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      saveTemplateRequest.onsuccess = function (event) {
        if (event !== null && event.target instanceof IDBRequest)
          onsuccess();
      }
    })
  }

  saveCharacterTemplates(templates: CharacterTemplates, onsuccess = nothing, onerror: DBErrorFunc = dbErrorFunc) {
    this.database.then(db => {
      const saveTemplatesRequest = db.transaction(['characterTemplates'], 'readwrite');
      const keys: String[] = [];

      saveTemplatesRequest.onerror = function (event: Event) {
        if (event !== null && event.target instanceof IDBRequest)
          onerror(event.target.error);
      };

      saveTemplatesRequest.oncomplete = function (event) {
        onsuccess();
      };

      templates.forEach(template => {
        const templateObject = {
          name: template.name,
          selectedCharacters:
            template.selectedCharacters.map(({ id, target }) => ({
              id: id,
              target: target
            }))
        };

        const singleRequest = saveTemplatesRequest.objectStore('characterTemplates').put(templateObject);

        singleRequest.onsuccess = function (event) {
          if (event !== null && event.target instanceof IDBRequest)
            keys.push(event.target.result);
        };
      });
    })
  }
}

let instance: Database | null = null;

export default function getDatabase(onsuccess: DBSuccessFunc = dbSuccessFunc, onerror: DBErrorFunc = dbErrorFunc) {
  if (instance) {
    onsuccess(instance);
    return instance;
  }

  instance = new Database(onsuccess, onerror);
  return instance;
};
