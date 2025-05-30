import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["admin", "seller", "customer"],
  },
  permissions: {
    type: [String],
    required: true,
    default: [],
  },
});

const Role = mongoose.model("Role", roleSchema);
export default Role;
