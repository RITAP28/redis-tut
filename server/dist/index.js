"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
client.on('error', (err) => console.log('Redis Client Error: ', err));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, language } = req.body;
    try {
        yield client.lPush("submissions", JSON.stringify({ problemId, code, language }));
        res.status(200).json({
            msg: "Submission successfull"
        });
    }
    catch (error) {
        console.error("Redis Error: ", error);
        res.status(500).json({
            msg: "Submission failed :("
        });
    }
    ;
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Redis server connected successfully");
            app.listen(3000, () => {
                console.log("Server started on port 3000");
            });
        }
        catch (error) {
            console.error("Error while starting server: ", error);
        }
        ;
    });
}
;
startServer();
