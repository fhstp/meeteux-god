"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contentTypes = require("../config/contentTypes");
const contentLanguages = require("../config/contentLanguages");
class DataFactory {
    static getInstance() {
        if (DataFactory._instance === null || DataFactory._instance === undefined) {
            DataFactory._instance = new DataFactory();
        }
        return DataFactory._instance;
    }
    createData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initSettings();
            // order is important don't change!
            yield this.createLocationTypes();
            yield this.createStatusTypes();
            yield this.createRoomLocations();
            yield this.createPassiveLocations();
            yield this.createActiveExhibitLocation();
            yield this.createActiveExhibitBehaviorLocation();
            yield this.createContentTypes();
            yield this.createContentLanguages();
            yield this.createExhibitContent();
        });
    }
    initSettings() {
        this._connection.settings.create({
            guestNumber: 1,
            wifiSSID: 'MEETeUX'
        });
    }
    createLocationTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.locationType.create({ id: 1, description: 'room' }),
                    this._connection.locationType.create({ id: 2, description: 'activeExhibitOn' }),
                    this._connection.locationType.create({ id: 3, description: 'activeExhibitAt' }),
                    this._connection.locationType.create({ id: 4, description: 'passiveExhibit' }),
                    this._connection.locationType.create({ id: 5, description: 'door' }),
                    this._connection.locationType.create({ id: 6, description: 'activeExhibitBehaviorAt' }),
                    this._connection.locationType.create({ id: 7, description: 'activeExhibitBehaviorOn' })
                ]);
            });
        });
    }
    createStatusTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.status.create({ id: 1, description: 'online' }),
                    this._connection.status.create({ id: 2, description: 'offline' }),
                    this._connection.status.create({ id: 3, description: 'free' }),
                    this._connection.status.create({ id: 4, description: 'occupied' })
                ]);
            });
        });
    }
    createContentTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.contentType.create({ id: contentTypes.TEXT, description: 'text' }),
                    this._connection.contentType.create({ id: contentTypes.IMAGE, description: 'image' })
                ]);
            });
        });
    }
    createContentLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.contentLanguage.create({ id: contentLanguages.ENG, description: 'English', tag: 'ENG' }),
                    this._connection.contentLanguage.create({ id: contentLanguages.GER, description: 'Deutsch', tag: 'GER' }),
                    this._connection.contentLanguage.create({
                        id: contentLanguages.ALL,
                        description: 'All Languages',
                        tag: 'ALL'
                    })
                ]);
            });
        });
    }
    createExhibitContent() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.content.create({
                        content: 'Willkommen beim Quiz!',
                        order: 1,
                        contentTypeId: contentTypes.TEXT,
                        contentLanguageId: contentLanguages.GER,
                        locationId: 100
                    }),
                    this._connection.content.create({
                        content: 'Welcome to the Quiz!',
                        order: 1,
                        contentTypeId: contentTypes.TEXT,
                        contentLanguageId: contentLanguages.ENG,
                        locationId: 100
                    }),
                    this._connection.content.create({
                        content: 'https://www.mememaker.net/api/bucket?path=static/img/memes/full/2018/Apr/4/14/it-works-now-1247.png',
                        order: 2,
                        contentTypeId: contentTypes.IMAGE,
                        contentLanguageId: contentLanguages.ALL,
                        locationId: 1011
                    }),
                    this._connection.content.create({
                        content: 'Willkommen beim Passive Exhibit10011!',
                        order: 1,
                        contentTypeId: contentTypes.TEXT,
                        contentLanguageId: contentLanguages.GER,
                        locationId: 1011
                    }),
                    this._connection.content.create({
                        content: 'Welcome at the passive exhibit 1011!',
                        order: 1,
                        contentTypeId: contentTypes.TEXT,
                        contentLanguageId: contentLanguages.ENG,
                        locationId: 1011
                    })
                ]);
            });
        });
    }
    createRoomLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.location.create({
                        id: 10,
                        description: 'Büro',
                        locationTypeId: 1,
                        statusId: 1,
                        ipAddress: '0.0.0.0',
                        isStartPoint: true
                    })
                ]);
            });
        });
    }
    createActiveExhibitLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.location.create({
                        id: 100,
                        parentId: 10,
                        description: 'Table1 atExhibit',
                        contentURL: 'tableat',
                        ipAddress: '192.168.178.253',
                        locationTypeId: 3,
                        contentTypeId: 1,
                        statusId: 2,
                        currentSeat: 0,
                        maxSeat: 4,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1000,
                        description: 'Table1 onExhibit-1',
                        parentId: 100,
                        contentURL: 'tableon',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 2,
                        contentTypeId: 1,
                        statusId: 2
                    }),
                    this._connection.location.create({
                        id: 1001,
                        description: 'Table1 onExhibit-2',
                        parentId: 100,
                        contentURL: 'tableon',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 2,
                        contentTypeId: 1,
                        statusId: 2
                    }),
                    this._connection.location.create({
                        id: 1002,
                        description: 'Table1 onExhibit-3',
                        parentId: 100,
                        contentURL: 'tableon',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 2,
                        contentTypeId: 1,
                        statusId: 2
                    }),
                    this._connection.location.create({
                        id: 1003,
                        description: 'Table1 onExhibit-4',
                        parentId: 100,
                        contentURL: 'tableon',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 2,
                        contentTypeId: 1,
                        statusId: 2
                    })
                ]);
            });
        });
    }
    createActiveExhibitBehaviorLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.location.create({
                        id: 101,
                        parentId: 10,
                        description: 'Table2 atExhibitBehavior',
                        contentURL: 'tableat',
                        ipAddress: '192.168.178.252',
                        locationTypeId: 6,
                        contentTypeId: 1,
                        statusId: 2,
                        currentSeat: 0,
                        maxSeat: 15,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1013,
                        description: 'Table2 onExhibitBehavior',
                        parentId: 101,
                        contentURL: 'tableon',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 7,
                        contentTypeId: 1,
                        statusId: 2
                    })
                ]);
            });
        });
    }
    createPassiveLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._connection.sequelize.transaction(t1 => {
                return Promise.all([
                    this._connection.location.create({
                        id: 1004,
                        parentId: 10,
                        description: 'passive Exhibit1',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1005,
                        parentId: 10,
                        description: 'passive Exhibit2',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1006,
                        parentId: 10,
                        description: 'passive Exhibit3',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1007,
                        parentId: 10,
                        description: 'passive Exhibit4',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1008,
                        parentId: 10,
                        description: 'passive Exhibit5',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1009,
                        parentId: 10,
                        description: 'passive Exhibit6',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1010,
                        parentId: 10,
                        description: 'passive Exhibit7',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1011,
                        parentId: 10,
                        description: 'passive Exhibit8',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    }),
                    this._connection.location.create({
                        id: 1012,
                        parentId: 10,
                        description: 'passive Exhibit9',
                        contentURL: 'passive',
                        ipAddress: '0.0.0.0',
                        locationTypeId: 4,
                        contentTypeId: 1,
                        statusId: 1,
                        showInTimeline: true
                    })
                ]);
            });
        });
    }
    set connection(value) {
        this._connection = value;
    }
}
exports.DataFactory = DataFactory;
//# sourceMappingURL=dataFactory.js.map