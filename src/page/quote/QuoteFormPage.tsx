// pages/QuoteFormPage.tsx
import React, { useEffect, useState } from "react";
import { Button, App, Modal } from "antd";
import { useQuoteStore } from "@/store/useQuoteStore";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { debounce, throttle } from "lodash-es";
import { Form } from "antd";
import QuoteForm from "@/components/quote/QuoteForm";

const QuoteFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const quoteId = parseInt(id ?? "");
  const navigate = useNavigate();
  const { fetchQuote, updateQuote, saveQuote } = useQuoteStore();
  const [form] = Form.useForm();

  const quote = useQuoteStore((state) =>
    state.quotes.find((quote) => quote.id == parseInt(id ?? "0"))
  );

  useEffect(() => {
    const loadQuote = async () => {
      if (id && !quote) {
        try {
          const newQuote = await fetchQuote(parseInt(id));
          if (!newQuote) {
            navigate("/error/no-permission", { replace: true });
            return;
          }
        } catch (error) {
          navigate("/error/no-permission", { replace: true });
          return;
        }
      }

      if (quote) {
        const { items, ...restQuote } = quote;
        form.setFieldsValue({
          ...restQuote,
          quoteTime: quote.quoteTime ? dayjs(quote.quoteTime) : null,
          customerName: {
            name: quote.customerName,
            value: quote.customerName,
            id: quote.customerId,
          } as any,
        });
      }
    };

    loadQuote();
  }, [id, quote?.id]);

  return (
    <QuoteForm
      form={form}
      quoteId={quote?.id}
      onSubmit={() => navigate(-1)}
    />
  );
};

export default QuoteFormPage;
