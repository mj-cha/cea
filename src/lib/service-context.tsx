import { createContext, useContext, useState, type ReactNode } from "react";
import { services } from "@/data/services";

/** 종합 ESG 서비스 탭에서 열려 있는 영역. 히어로·교육 카드에서도 바꿀 수 있게 공유한다. */
type Ctx = { selected: string; select: (id: string) => void };
const ServiceContext = createContext<Ctx | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState(services[0].id);
  return <ServiceContext.Provider value={{ selected, select: setSelected }}>{children}</ServiceContext.Provider>;
}

export function useService() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useService는 ServiceProvider 안에서만 쓸 수 있습니다.");
  return ctx;
}
