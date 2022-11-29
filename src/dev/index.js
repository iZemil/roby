"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.roby = void 0;
var axios_1 = __importDefault(require("axios"));
var fs = __importStar(require("fs/promises"));
var path = __importStar(require("path"));
var utils_1 = require("./utils");
var CONFIG_FILENAME = "roby.config.js";
var RESULT_FILENAME = "roby.result.json";
var DEFAULT_CONFIG = {
    baseUrl: "https://www.npmjs.com/package",
    resultHandler: function () {
        return;
    },
    urlHanlder: function (baseUrl, item) { return "".concat(baseUrl, "/").concat(item); },
    delay: 500,
    items: ['foo', 'bar']
};
function isAxiosError(error) {
    if ('response' in error) {
        return true;
    }
    return false;
}
var roby = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var init, run, e_1, configData, baseUrl, items, urlHanlder, resultHandler, result, _i, _a, item, url, status_1, response, e_2, e_3, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                init = options.init, run = options.run;
                if (!init) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.writeFile(CONFIG_FILENAME, "\n                module.exports = ".concat(JSON.stringify(DEFAULT_CONFIG), "\n            "))];
            case 2:
                _b.sent();
                console.log("Config file was created.");
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
            case 5:
                if (!run) return [3 /*break*/, 20];
                _b.label = 6;
            case 6:
                _b.trys.push([6, 18, , 19]);
                configData = require(path.resolve("./".concat(CONFIG_FILENAME)));
                baseUrl = configData.baseUrl, items = configData.items, urlHanlder = configData.urlHanlder, resultHandler = configData.resultHandler;
                result = [];
                // Validate configuration:
                if (items.length === 0) {
                    console.log("Specify config items, eg: items: [\"foo\", \"bar\"]");
                    return [2 /*return*/];
                }
                if (!baseUrl) {
                    console.log("Specify config baseUrl");
                    return [2 /*return*/];
                }
                if (!resultHandler) {
                    console.log("Specify config resultHandler");
                    return [2 /*return*/];
                }
                console.log('Roby is running...');
                _i = 0, _a = configData.items;
                _b.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 14];
                item = _a[_i];
                url = urlHanlder(baseUrl, item);
                status_1 = undefined;
                response = null;
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 11]);
                return [4 /*yield*/, axios_1["default"].get(url)];
            case 9:
                response = (_b.sent());
                status_1 = response.status;
                return [3 /*break*/, 11];
            case 10:
                e_2 = _b.sent();
                if (isAxiosError(e_2) && e_2.response) {
                    status_1 = e_2.response.status;
                }
                return [3 /*break*/, 11];
            case 11:
                console.log("".concat(status_1, ": ").concat(url));
                result.push(resultHandler(response, item));
                return [4 /*yield*/, (0, utils_1.delay)(configData.delay)];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 7];
            case 14:
                _b.trys.push([14, 16, , 17]);
                return [4 /*yield*/, fs.writeFile(RESULT_FILENAME, JSON.stringify(result))];
            case 15:
                _b.sent();
                return [3 /*break*/, 17];
            case 16:
                e_3 = _b.sent();
                console.error(e_3);
                return [3 /*break*/, 17];
            case 17:
                console.log("Finished, see: ".concat(path.resolve(RESULT_FILENAME)));
                return [2 /*return*/];
            case 18:
                e_4 = _b.sent();
                console.error(e_4);
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
            case 20:
                console.log("No options. Run: roby --help");
                return [2 /*return*/];
        }
    });
}); };
exports.roby = roby;
