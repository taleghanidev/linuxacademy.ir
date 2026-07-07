import CouponManager from "@/components/admin/CouponManager";
import adminFa from "@/language/fa/admin";
import { getCouponsList } from "../queries";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await getCouponsList();

  return (
    <>
      <div>
        <h1 className="text-xl font-bold">{adminFa.pageTitles.coupons}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{adminFa.pageSubs.coupons}</p>
      </div>
      <CouponManager initial={coupons} />
    </>
  );
}
