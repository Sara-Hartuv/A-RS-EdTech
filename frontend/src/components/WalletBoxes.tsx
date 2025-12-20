import { Award, Gift, ShoppingCart } from 'lucide-react';

type Props = {
  certificates: number;
  vouchers: number;
};

export default function WalletBoxes({ certificates, vouchers }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">תעודות שלי</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{certificates}</div>
        </div>
        <div className="bg-amber-50 rounded-full p-3">
          <Award className="text-amber-600" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">הארנק שלי</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{vouchers}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-emerald-50 rounded-full p-3">
            <Gift className="text-emerald-600" />
          </div>
          <button className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            לכיוון החנות
          </button>
        </div>
      </div>
    </div>
  );
}
