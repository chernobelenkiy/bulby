"use client";
import React, { useEffect, useRef } from "react";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export interface ITelegramUser {
  id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  usePic?: boolean;
  className?: string;
  cornerRadius?: number;
  requestAccess?: boolean;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  dataOnauth: (user: ITelegramUser) => void;
  dataAuthUrl?: string;
  buttonSize?: "large" | "medium" | "small";
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: ITelegramUser) => void;
    };
  }
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  wrapperProps,
  dataAuthUrl,
  usePic = true,
  botName,
  className,
  buttonSize = "large",
  dataOnauth,
  cornerRadius = 12,
  requestAccess = true,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current === null) return;

    if (
      typeof dataOnauth === "undefined" &&
      typeof dataAuthUrl === "undefined"
    ) {
      throw new Error(
        "One of these props should be defined: dataAuthUrl (redirect URL) or dataOnauth (callback fn)."
      );
    }

    if (typeof dataOnauth === "function") {
      window.TelegramLoginWidget = {
        dataOnauth: (user: ITelegramUser) => {
          dataOnauth(user);
        },
      };
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);

    if (cornerRadius !== undefined) {
      script.setAttribute("data-radius", cornerRadius.toString());
    }

    if (requestAccess) {
      script.setAttribute("data-request-access", "write");
    }

    if (DOMAIN) {
      script.setAttribute("data-domain-hint", DOMAIN);
    }

    script.setAttribute("data-userpic", usePic.toString());
    script.setAttribute("data-lang", "ru");

    if (typeof dataAuthUrl === "string") {
      script.setAttribute("data-auth-url", dataAuthUrl);
    } else {
      script.setAttribute(
        "data-onauth",
        "TelegramLoginWidget.dataOnauth(user)"
      );
    }
    
    script.async = true;

    ref.current.appendChild(script);
    
    return () => {
      // Cleanup
      if (ref.current && ref.current.contains(script)) {
        ref.current.removeChild(script);
      }
    };
  }, [
    botName,
    buttonSize,
    cornerRadius,
    dataOnauth,
    requestAccess,
    usePic,
    dataAuthUrl,
  ]);

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ 
        ...style,
        minHeight: buttonSize === "large" ? "50px" : buttonSize === "medium" ? "40px" : "30px",
      }} 
      {...wrapperProps} 
    />
  );
}; 