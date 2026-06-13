import DieForm from "@/components/quoteForm/dieForm/DieForm";
import FeedblockForm from "@/components/quoteForm/FeedblockForm/FeedblockForm";
import FilterForm from "@/components/quoteForm/FilterForm/FilterForm";
import HydraulicStationForm from "@/components/quoteForm/HydraulicStationForm/HydraulicStationForm";
import MeteringPumpForm from "@/components/quoteForm/MeteringPumpForm/MeteringPumpForm";
import ManifoldForm from "@/components/quoteForm/ManifoldForm/ManifoldForm";
import { OtherForm } from "@/components/quoteForm/OtherForm";
import PartsForm from "@/components/quoteForm/PartsForm";
import SmartRegulator from "@/components/quoteForm/SmartRegulator";
import ThicknessGaugeForm from "@/components/quoteForm/ThicknessGaugeForm/ThicknessGaugeForm";
import CoatingDieForm from "@/components/quoteForm/CoatingDieForm/CoatingDieForm";
import React, { RefObject } from "react";
import { getFormType } from "./formType";

export type ModelFormRef = RefObject<{ form: any } | null>;
export { getFormType };

export function getFormByCategory(
  category: string[] | undefined | null,
  quoteId: number,
  quoteItemId: number,
  modelFormRef: ModelFormRef,
  formTypeOverride?: string,
  readOnly?: boolean
): { form: React.ReactNode; formType: string } {
  const formType = formTypeOverride || getFormType(category);
  if (formType === "DieForm")
    return {
      form: (
        <DieForm
          quoteItemId={quoteItemId}
          quoteId={quoteId}
          ref={modelFormRef}
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
      ),
      formType,
    };
  if (formType === "ManifoldForm")
    return {
      form: (
        <ManifoldForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
      ),
      formType,
    };
  if (formType === "CoatingDieForm")
    return {
      form: (
        <CoatingDieForm
          ref={modelFormRef}
          quoteId={quoteId}
          quoteItemId={quoteItemId}
          readOnly={readOnly}
        />
      ),
      formType,
    };
  if (formType === "PartsForm")
    return {
      form: <PartsForm ref={modelFormRef} readOnly={readOnly} />,
      formType,
    };
  return {
    form: <OtherForm ref={modelFormRef} readOnly={readOnly} />,
    formType,
  };
}
