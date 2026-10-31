import { app } from "./app.js";
import { ReusableSolutionsModel } from "./models/mysql/reusable-solutions.model.js";
import { TagsModel } from "./models/mysql/tags.model.js";
import { TechnologiesModel } from "./models/mysql/technologies.model.js";
import { CategoriesModel } from "./models/mysql/categories.model.js";

app(ReusableSolutionsModel, TagsModel, TechnologiesModel, CategoriesController);

// executable