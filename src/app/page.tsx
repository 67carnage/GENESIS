"use client";

import React from "react";
import BudgetTracker from "@/components/BudgetTracker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          BUDGET TRACKER
        </h1>
        <p className="text-center text-gray-600">
          Manage your budget and track expenses efficiently
        </p>
      </header>
      <BudgetTracker />
    </div>
  );
}
