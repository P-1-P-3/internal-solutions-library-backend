import { app } from "./app.js";
import { DashboardStatsModel } from "./models/mysql/dashboard-stats.model.js";
import { ReusableSolutionsModel } from "./models/mysql/reusable-solutions.model.js";
import { TagsModel } from "./models/mysql/tags.model.js";
import { TechnologiesModel } from "./models/mysql/technologies.model.js";
import { CategoriesModel } from "./models/mysql/categories.model.js";
import { FunctionalAreasModel } from "./models/mysql/functional-areas.model.js";

app(ReusableSolutionsModel, TagsModel, TechnologiesModel, CategoriesModel, FunctionalAreasModel, DashboardStatsModel);

// executable
