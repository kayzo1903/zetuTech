import Maintainance from "@/components/mainatinance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance - zetuTech",
  description:
    "zetuTech is currently undergoing maintenance to improve your shopping experience. We'll be back shortly with exciting new features and enhancements.",
};

export default function Page() {
  return (
    <section>
      <Maintainance />
    </section>
  );
}
