import { app } from "./app.js";
import { ReusableSolutionsModel } from "./models/mysql/reusable-solutions.model.js";
import { TagsModel } from "./models/mysql/tags.model.js";

app(ReusableSolutionsModel, TagsModel);