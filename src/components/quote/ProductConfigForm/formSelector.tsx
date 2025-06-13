import React, { RefObject } from "react";
import DieForm from "../../quoteForm/dieForm/DieForm";
import SmartRegulator from "../../quoteForm/SmartRegulator";
import MeteringPumpForm from "../../quoteForm/MeteringPumpForm/MeteringPumpForm";
import FeedblockForm from "../../quoteForm/FeedblockForm/FeedblockForm";
import FilterForm from "../../quoteForm/FilterForm/FilterForm";
import ThicknessGaugeForm from "../../quoteForm/ThicknessGaugeForm/ThicknessGaugeForm";
import HydraulicStationForm from "../../quoteForm/HydraulicStationForm/HydraulicStationForm";
import GiftForm from "../../quoteForm/GiftForm";
import { OtherForm } from "../../quoteForm/OtherForm";

export type ModelFormRef = RefObject<{ form: any } | null>;

export function getFormType(category: string[] | undefined | null): string {
  if (category?.includes("平模")) return "DieForm";
  if (category?.includes("智能调节器")) return "SmartRegulator";
  if (category?.at(1) == "熔体计量泵") return "MeteringPumpForm";
  if (category?.at(1) == "共挤复合分配器") return "FeedblockForm";
  if (category?.at(1) == "过滤器") return "FilterForm";
  if (category?.at(1) == "测厚仪") return "ThicknessGaugeForm";
  if (category?.includes("液压站")) return "HydraulicStationForm";
  if (category?.[1]?.includes("赠品")) return "GiftForm";
  return "OtherForm";
}

export function getFormByCategory(
  category: string[] | undefined | null,
  quoteId: number,
  quoteItemId: number,
  modelFormRef: ModelFormRef,
  formTypeOverride?: string
): { form: React.ReactNode; formType: string } {
  const formType = formTypeOverride || getFormType(category);
  if (formType === "DieForm")
    return {
      form: (
        <DieForm
          quoteItemId={quoteItemId}
          quoteId={quoteId}
          ref={modelFormRef}
        />
      ),
      formType,
    };
  if (formType === "SmartRegulator")
    return {
      form: (
        <SmartRegulator
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "MeteringPumpForm")
    return {
      form: (
        <MeteringPumpForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "FeedblockForm")
    return {
      form: (
        <FeedblockForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "FilterForm")
    return {
      form: (
        <FilterForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "ThicknessGaugeForm")
    return {
      form: (
        <ThicknessGaugeForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "HydraulicStationForm")
    return {
      form: (
        <HydraulicStationForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
        />
      ),
      formType,
    };
  if (formType === "GiftForm")
    return { form: <GiftForm ref={modelFormRef} />, formType };
  return { form: <OtherForm ref={modelFormRef} />, formType };
}
