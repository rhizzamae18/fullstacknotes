var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Allow, Entity, Fields } from "remult";
let Task = class Task {
    id = 0;
    title = "";
    completed = false;
};
__decorate([
    Fields.autoIncrement(),
    __metadata("design:type", Object)
], Task.prototype, "id", void 0);
__decorate([
    Fields.string({
        validate: (task) => {
            if (task.title.length < 3)
                throw Error("Too short");
        }
    }),
    __metadata("design:type", Object)
], Task.prototype, "title", void 0);
__decorate([
    Fields.boolean(),
    __metadata("design:type", Object)
], Task.prototype, "completed", void 0);
Task = __decorate([
    Entity("tasks", {
        allowApiCrud: Allow.authenticated,
        allowApiDelete: "admin",
        allowApiInsert: "admin"
    })
], Task);
export { Task };
