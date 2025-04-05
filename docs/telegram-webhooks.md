import {
  deleteWebhook,
  getWebhookInfo,
  setWebhook,
} from "@/app/_server/API/telegram/utils/webhook";
import { NextResponse } from "next/server";

export const maxDuration = 25;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "set":
        const setResult = await setWebhook();
        return NextResponse.json(setResult);

      case "delete":
        const deleteResult = await deleteWebhook();
        return NextResponse.json(deleteResult);

      case "info":
        const infoResult = await getWebhookInfo();
        return NextResponse.json(infoResult);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Webhook management error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

import axios from "axios";
import { CONFIG } from "../constants";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TG_AUTH_BOT_API_KEY}`;

export const setWebhook = async () => {
  const webhookUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/telegram/webhook`;
  try {
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${webhookUrl}`,
    );
    console.log("Webhook set response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error setting webhook:", error);
    throw error;
  }
};

export const deleteWebhook = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API}/deleteWebhook`);
    console.log("Webhook delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting webhook:", error);
    throw error;
  }
};

export const getWebhookInfo = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API}/getWebhookInfo`);
    console.log("Webhook info:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting webhook info:", error);
    throw error;
  }
};

export const updateBotCommands = async () => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/setMyCommands`, {
      commands: CONFIG.COMMANDS,
    });
    console.log("Bot commands updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating bot commands:", error);
    throw error;
  }
};
