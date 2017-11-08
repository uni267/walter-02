import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const DisplayItemSchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  meta_info_id: Schema.Types.ObjectId,
  label: String,
  name: String,
  search_value_type: String,
  is_display: Boolean,
  order: Number
});

const DisplayItem = mongoose.model(
  "display_items", DisplayItemSchema, "display_items"
);

export default DisplayItem;
