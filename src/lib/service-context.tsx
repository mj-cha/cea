import { createContext, useContext, useState, type ReactNode } from "react";
import { services } from "@/data/services";

/** 분야별 ESG 자문 탭 선택 상태 및 상담 신청 관심 분야 연동 컨텍스트 */
type Ctx = {
  selected: string;
  select: (id: string) => void;
  contactInterest: string | null;
  requestConsult: (interest: string) => void;
};

const ServiceContext = createContext<Ctx | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState(services[0].id);
  const [contactInterest, setContactInterest] = useState<string | null>(null);

  const requestConsult = (interest: string) => {
    setContactInterest(interest);
  };

  return (
    <ServiceContext.Provider value={{ selected, select: setSelected, contactInterest, requestConsult }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useService는 ServiceProvider 안에서만 쓸 수 있습니다.");
  return ctx;
}
