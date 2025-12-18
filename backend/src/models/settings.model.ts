import mongoose, { Document } from "mongoose";

export interface ISettings extends Document {
  siteActiveFrom: Date | null;
  siteActiveTo: Date | null;
  isRedeemOpen: boolean;
  kioskInfo: string;
  purchaseRules: string[];
  pointsPerVoucher: number;
}

const SettingsSchema = new mongoose.Schema<ISettings>(
  {
    siteActiveFrom: {
      type: Date,
      default: null
    },

    siteActiveTo: {
      type: Date,
      default: null
    },

    isRedeemOpen: {
      type: Boolean,
      default: true
    },

    kioskInfo: {
      type: String,
      default: ""
    },

    purchaseRules: {
      type: [String],
      default: []
    },

    pointsPerVoucher: {
      type: Number,
      required: true,
      default: 100,
      min: [1, 'Points per voucher must be at least 1']
    }
  },

  { timestamps: true }
);

const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
