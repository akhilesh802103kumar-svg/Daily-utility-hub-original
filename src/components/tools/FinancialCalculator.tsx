import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  Receipt,
  RotateCcw,
  TrendingUp,
  Coins,
  Tag,
  ShieldAlert,
  Info,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export type FinCalcMode =
  | 'gst'
  | 'percentage'
  | 'emi'
  | 'loan'
  | 'simple-interest'
  | 'compound-interest'
  | 'discount'
  | 'tax-estimator';

export const FinancialCalculator: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<FinCalcMode>('gst');

  // Format INR Currency Helper
  const formatINR = (val: number, decimals: number = 0) => {
    if (isNaN(val)) return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(val);
  };

  // --- 1. GST CALCULATOR STATE ---
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // GST Math:
  // Exclusive: GST = Amount * Rate / 100, Total = Amount + GST
  // Inclusive: Base = Amount * 100 / (100 + Rate), GST = Amount - Base
  let gstBaseAmount = gstAmount;
  let gstCalculatedTax = 0;
  let gstTotalAmount = gstAmount;

  if (gstType === 'exclusive') {
    gstCalculatedTax = (gstAmount * gstRate) / 100;
    gstTotalAmount = gstAmount + gstCalculatedTax;
    gstBaseAmount = gstAmount;
  } else {
    gstBaseAmount = (gstAmount * 100) / (100 + gstRate);
    gstCalculatedTax = gstAmount - gstBaseAmount;
    gstTotalAmount = gstAmount;
  }
  const cgst = gstCalculatedTax / 2;
  const sgst = gstCalculatedTax / 2;

  // --- 2. PERCENTAGE CALCULATOR STATE ---
  const [pctMode, setPctMode] = useState<'of' | 'is-what' | 'change'>('of');
  const [pctX, setPctX] = useState<number>(20);
  const [pctY, setPctY] = useState<number>(500);

  // 1. What is X% of Y? = (X / 100) * Y
  // 2. X is what % of Y? = (X / Y) * 100
  // 3. Percentage change from X to Y? = ((Y - X) / X) * 100
  let pctResult = 0;
  if (pctMode === 'of') {
    pctResult = (pctX / 100) * pctY;
  } else if (pctMode === 'is-what') {
    pctResult = pctY !== 0 ? (pctX / pctY) * 100 : 0;
  } else {
    pctResult = pctX !== 0 ? ((pctY - pctX) / pctX) * 100 : 0;
  }

  // --- 3. EMI CALCULATOR STATE ---
  const [emiPrincipal, setEmiPrincipal] = useState<number>(2500000); // ₹25,00,000
  const [emiAnnualRate, setEmiAnnualRate] = useState<number>(8.5); // 8.5%
  const [emiDurationYears, setEmiDurationYears] = useState<number>(20);

  // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const emiMonthlyRate = emiAnnualRate / 12 / 100;
  const emiTotalMonths = emiDurationYears * 12;
  const emiPow = Math.pow(1 + emiMonthlyRate, emiTotalMonths);
  const monthlyEmi =
    emiPow - 1 !== 0
      ? Math.round((emiPrincipal * emiMonthlyRate * emiPow) / (emiPow - 1))
      : 0;
  const emiTotalRepayment = monthlyEmi * emiTotalMonths;
  const emiTotalInterest = Math.max(0, emiTotalRepayment - emiPrincipal);
  const emiPrincipalPercent = emiTotalRepayment > 0 ? Math.round((emiPrincipal / emiTotalRepayment) * 100) : 0;

  // --- 4. LOAN TENURE COMPARISON CALCULATOR ---
  const [loanPrincipal, setLoanPrincipal] = useState<number>(1000000);
  const [loanRate, setLoanRate] = useState<number>(9.0);
  const [loanTenureA, setLoanTenureA] = useState<number>(10);
  const [loanTenureB, setLoanTenureB] = useState<number>(15);

  const calcEmiForTenure = (P: number, rAnnual: number, years: number) => {
    const r = rAnnual / 12 / 100;
    const n = years * 12;
    const p = Math.pow(1 + r, n);
    const emi = p - 1 !== 0 ? (P * r * p) / (p - 1) : 0;
    const totalRepay = emi * n;
    const totalInt = totalRepay - P;
    return { emi: Math.round(emi), totalRepay: Math.round(totalRepay), totalInt: Math.round(totalInt) };
  };
  const loanPlanA = calcEmiForTenure(loanPrincipal, loanRate, loanTenureA);
  const loanPlanB = calcEmiForTenure(loanPrincipal, loanRate, loanTenureB);

  // --- 5. SIMPLE INTEREST STATE ---
  const [siPrincipal, setSiPrincipal] = useState<number>(100000);
  const [siRate, setSiRate] = useState<number>(7.5);
  const [siTimeYears, setSiTimeYears] = useState<number>(5);

  // SI = (P * R * T) / 100
  const siInterest = (siPrincipal * siRate * siTimeYears) / 100;
  const siTotalMaturity = siPrincipal + siInterest;

  // --- 6. COMPOUND INTEREST STATE ---
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(8.0);
  const [ciTimeYears, setCiTimeYears] = useState<number>(5);
  const [ciFrequency, setCiFrequency] = useState<number>(4); // Quarterly (4), Monthly (12), Annually (1)

  // A = P * (1 + r/n)^(n*t)
  const ciRateDecimal = ciRate / 100;
  const ciTotalAmount =
    ciPrincipal * Math.pow(1 + ciRateDecimal / ciFrequency, ciFrequency * ciTimeYears);
  const ciInterestEarned = Math.max(0, ciTotalAmount - ciPrincipal);

  // --- 7. DISCOUNT CALCULATOR STATE ---
  const [discountOriginal, setDiscountOriginal] = useState<number>(2499);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [additionalCouponPercent, setAdditionalCouponPercent] = useState<number>(5);

  const firstDiscount = (discountOriginal * discountPercent) / 100;
  const afterFirst = discountOriginal - firstDiscount;
  const couponDiscount = (afterFirst * additionalCouponPercent) / 100;
  const finalDiscountedPrice = afterFirst - couponDiscount;
  const totalDiscountSaved = discountOriginal - finalDiscountedPrice;

  // --- 8. TAX ESTIMATOR STATE (Indian Income Tax Estimate FY 2025-26 / 2026-27 New Regime) ---
  const [annualIncome, setAnnualIncome] = useState<number>(1200000); // 12 Lakhs
  const [standardDeduction, setStandardDeduction] = useState<number>(75000); // New standard deduction
  const taxableIncome = Math.max(0, annualIncome - standardDeduction);

  // Slabs New Regime (simplified estimation):
  // Up to 3L: Nil
  // 3L - 7L: 5%
  // 7L - 10L: 10%
  // 10L - 12L: 15%
  // 12L - 15L: 20%
  // Above 15L: 30%
  // Section 87A rebate if taxable income <= 7,00,000 -> Tax is Nil
  let estimatedTax = 0;
  if (taxableIncome <= 700000) {
    estimatedTax = 0; // Rebate applies
  } else {
    let incomeRemaining = taxableIncome;
    // 0 - 300,000: 0%
    incomeRemaining = Math.max(0, incomeRemaining - 300000);

    // 300,001 - 700,000 (400,000 @ 5% = 20,000)
    const slab1 = Math.min(incomeRemaining, 400000);
    estimatedTax += slab1 * 0.05;
    incomeRemaining = Math.max(0, incomeRemaining - slab1);

    // 700,001 - 1,000,000 (300,000 @ 10% = 30,000)
    const slab2 = Math.min(incomeRemaining, 300000);
    estimatedTax += slab2 * 0.10;
    incomeRemaining = Math.max(0, incomeRemaining - slab2);

    // 1,000,001 - 1,200,000 (200,000 @ 15% = 30,000)
    const slab3 = Math.min(incomeRemaining, 200000);
    estimatedTax += slab3 * 0.15;
    incomeRemaining = Math.max(0, incomeRemaining - slab3);

    // 1,200,001 - 1,500,000 (300,000 @ 20% = 60,000)
    const slab4 = Math.min(incomeRemaining, 300000);
    estimatedTax += slab4 * 0.20;
    incomeRemaining = Math.max(0, incomeRemaining - slab4);

    // Above 1,500,000 @ 30%
    if (incomeRemaining > 0) {
      estimatedTax += incomeRemaining * 0.30;
    }
  }
  const healthEduCess = Math.round(estimatedTax * 0.04);
  const totalTaxPayable = Math.round(estimatedTax + healthEduCess);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-[#172554]">
      {/* Tool Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 via-white to-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#172554]">Financial Calculator</h2>
              <p className="text-xs text-[#64748B]">
                8 essential Indian Rupee (₹) calculators with mathematical formulas and instant breakdowns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Route: <span className="text-[#1456D9] font-mono">/tools/financial-calculator</span>
            </span>
          </div>
        </div>

        {/* Calculator Navigation Bar (8 Calculators) */}
        <div className="mt-6 flex p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none gap-1">
          {[
            { id: 'gst', label: 'GST Calculator', icon: Receipt },
            { id: 'percentage', label: 'Percentage', icon: Percent },
            { id: 'emi', label: 'EMI Calculator', icon: Calculator },
            { id: 'loan', label: 'Loan Compare', icon: Layers },
            { id: 'simple-interest', label: 'Simple Interest', icon: Coins },
            { id: 'compound-interest', label: 'Compound Interest', icon: TrendingUp },
            { id: 'discount', label: 'Discount', icon: Tag },
            { id: 'tax-estimator', label: 'Tax Estimator', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCalc === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCalc(tab.id as FinCalcMode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* 1. GST CALCULATOR */}
        {activeCalc === 'gst' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#172554] mb-1.5">
                  Amount (₹ Indian Rupees)
                </label>
                <input
                  type="number"
                  min="1"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172554] mb-2">
                  Official GST Slab Rate
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setGstRate(rate)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        gstRate === rate
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172554] mb-2">Calculation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGstType('exclusive')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                      gstType === 'exclusive'
                        ? 'bg-[#1456D9] text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    GST Exclusive (Add Tax to Net)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGstType('inclusive')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                      gstType === 'inclusive'
                        ? 'bg-[#1456D9] text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    GST Inclusive (Extract Tax from Gross)
                  </button>
                </div>
              </div>

              {/* Mathematical Formula Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-mono">
                <span className="font-sans font-bold text-[#172554] block">Formula Used:</span>
                {gstType === 'exclusive' ? (
                  <p>GST Amount = (Original Cost × GST Rate%) ÷ 100</p>
                ) : (
                  <p>Original Cost = (Gross Amount × 100) ÷ (100 + GST Rate%)</p>
                )}
                <p>CGST (50%) = GST ÷ 2  |  SGST (50%) = GST ÷ 2</p>
              </div>
            </div>

            {/* GST Results Card */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {gstType === 'exclusive' ? 'Total Invoice Amount (Gross)' : 'Base Net Price (Pre-Tax)'}
                </span>
                <div className="mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#172554]">
                    ₹ {formatINR(gstTotalAmount, 2)}
                  </span>
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Pre-Tax Cost:</span>
                    <span className="font-mono font-bold text-[#172554]">₹ {formatINR(gstBaseAmount, 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CGST (Central {gstRate / 2}%):</span>
                    <span className="font-mono font-bold text-amber-700">₹ {formatINR(cgst, 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">SGST / UTGST (State {gstRate / 2}%):</span>
                    <span className="font-mono font-bold text-amber-700">₹ {formatINR(sgst, 2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-200 font-bold text-sm">
                    <span className="text-amber-950">Total GST Tax ({gstRate}%):</span>
                    <span className="font-mono text-amber-800">₹ {formatINR(gstCalculatedTax, 2)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-6">
                Calculated according to Indian Central Board of Indirect Taxes and Customs (CBIC) rules.
              </p>
            </div>
          </div>
        )}

        {/* 2. PERCENTAGE CALCULATOR */}
        {activeCalc === 'percentage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setPctMode('of')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    pctMode === 'of' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  X% of Y
                </button>
                <button
                  onClick={() => setPctMode('is-what')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    pctMode === 'is-what' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  X is what % of Y?
                </button>
                <button
                  onClick={() => setPctMode('change')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    pctMode === 'change' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  % Change (X to Y)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Value X
                  </label>
                  <input
                    type="number"
                    value={pctX}
                    onChange={(e) => setPctX(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Value Y
                  </label>
                  <input
                    type="number"
                    value={pctY}
                    onChange={(e) => setPctY(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <span className="font-sans font-bold text-[#172554] block mb-1">Formula:</span>
                {pctMode === 'of' && <p>Result = (X ÷ 100) × Y = ({pctX} ÷ 100) × {pctY}</p>}
                {pctMode === 'is-what' && <p>Result % = (X ÷ Y) × 100 = ({pctX} ÷ {pctY}) × 100</p>}
                {pctMode === 'change' && <p>Change % = ((Y - X) ÷ X) × 100 = (({pctY} - {pctX}) ÷ {pctX}) × 100</p>}
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {pctMode === 'of' ? `What is ${pctX}% of ${pctY}?` : pctMode === 'is-what' ? `${pctX} is what % of ${pctY}?` : `% Change from ${pctX} to ${pctY}`}
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#172554]">
                  {pctMode === 'of' ? formatINR(pctResult, 2) : `${pctResult.toFixed(2)}%`}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-amber-200/60">
                Instant percentage calculations for retail, taxes, tips, and financial margins.
              </p>
            </div>
          </div>
        )}

        {/* 3. EMI CALCULATOR */}
        {activeCalc === 'emi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Loan Principal Amount</span>
                  <span className="font-mono text-sm text-[#1456D9]">₹ {formatINR(emiPrincipal)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                  className="w-full accent-[#1456D9] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Annual Interest Rate (%)</span>
                  <span className="font-mono text-sm text-amber-700">{emiAnnualRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.1"
                  value={emiAnnualRate}
                  onChange={(e) => setEmiAnnualRate(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Loan Duration (Years)</span>
                  <span className="font-mono text-sm text-slate-800">{emiDurationYears} Years ({emiTotalMonths} Mos)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={emiDurationYears}
                  onChange={(e) => setEmiDurationYears(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <span className="font-sans font-bold text-[#172554] block mb-1">EMI Formula:</span>
                <p>E = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ - 1)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">where P = Principal, r = Monthly Rate, n = Months</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Monthly EMI</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1">
                  ₹ {formatINR(monthlyEmi)}
                  <span className="text-xs font-normal text-slate-500"> / month</span>
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Principal Amount:</span>
                    <span className="font-mono font-bold text-[#172554]">₹ {formatINR(emiPrincipal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Interest Payable:</span>
                    <span className="font-mono font-bold text-amber-700">₹ {formatINR(emiTotalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-200 font-bold text-sm">
                    <span className="text-amber-950">Total Repayment Amount:</span>
                    <span className="font-mono text-[#1456D9]">₹ {formatINR(emiTotalRepayment)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-6">
                Standard reducing balance calculation for Home, Car, and Personal loans in India.
              </p>
            </div>
          </div>
        )}

        {/* 4. LOAN TENURE COMPARISON */}
        {activeCalc === 'loan' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan A */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#172554]">Tenure Option A: {loanTenureA} Years</h4>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={loanTenureA}
                    onChange={(e) => setLoanTenureA(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono text-center"
                  />
                </div>
                <div className="text-2xl font-bold text-[#1456D9]">₹ {formatINR(loanPlanA.emi)}/mo</div>
                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Interest:</span>
                    <span className="font-mono font-bold text-amber-700">₹ {formatINR(loanPlanA.totalInt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Outflow:</span>
                    <span className="font-mono font-bold">₹ {formatINR(loanPlanA.totalRepay)}</span>
                  </div>
                </div>
              </div>

              {/* Plan B */}
              <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-amber-950">Tenure Option B: {loanTenureB} Years</h4>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={loanTenureB}
                    onChange={(e) => setLoanTenureB(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-amber-200 text-xs font-mono text-center bg-white"
                  />
                </div>
                <div className="text-2xl font-bold text-amber-800">₹ {formatINR(loanPlanB.emi)}/mo</div>
                <div className="text-xs space-y-1.5 pt-2 border-t border-amber-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Interest:</span>
                    <span className="font-mono font-bold text-amber-700">₹ {formatINR(loanPlanB.totalInt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Outflow:</span>
                    <span className="font-mono font-bold">₹ {formatINR(loanPlanB.totalRepay)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-[#1456D9] font-medium">
              Comparison Insight: Choosing Option A ({loanTenureA} years) over Option B ({loanTenureB} years) saves you{' '}
              <strong>₹ {formatINR(Math.abs(loanPlanB.totalInt - loanPlanA.totalInt))}</strong> in lifetime interest!
            </div>
          </div>
        )}

        {/* 5. SIMPLE INTEREST */}
        {activeCalc === 'simple-interest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Principal Amount (P in ₹)</label>
                <input
                  type="number"
                  value={siPrincipal}
                  onChange={(e) => setSiPrincipal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Annual Rate (R %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={siRate}
                    onChange={(e) => setSiRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Time Period (T in Years)</label>
                  <input
                    type="number"
                    value={siTimeYears}
                    onChange={(e) => setSiTimeYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <span className="font-sans font-bold text-[#172554] block mb-1">Formula:</span>
                <p>Simple Interest = (P × R × T) ÷ 100</p>
                <p>Maturity Total = Principal + Simple Interest</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Total Maturity Value</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1">
                  ₹ {formatINR(siTotalMaturity, 2)}
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Principal Deposit:</span>
                    <span className="font-mono font-bold text-[#172554]">₹ {formatINR(siPrincipal, 2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-950">Simple Interest Earned:</span>
                    <span className="font-mono text-amber-700">+ ₹ {formatINR(siInterest, 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. COMPOUND INTEREST */}
        {activeCalc === 'compound-interest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Principal Amount (P in ₹)</label>
                <input
                  type="number"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Annual Rate (r %)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ciRate}
                    onChange={(e) => setCiRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={ciTimeYears}
                    onChange={(e) => setCiTimeYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Compounding Frequency</label>
                <select
                  value={ciFrequency}
                  onChange={(e) => setCiFrequency(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white outline-none"
                >
                  <option value={1}>Annually (Once a year)</option>
                  <option value={2}>Half-Yearly (2 times a year)</option>
                  <option value={4}>Quarterly (4 times a year - Standard FD)</option>
                  <option value={12}>Monthly (12 times a year)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <span className="font-sans font-bold text-[#172554] block mb-1">Formula:</span>
                <p>A = P × (1 + r ÷ n)ⁿᵗ</p>
                <p className="text-[11px] text-slate-400 mt-0.5">where n = compounding periods per year, t = years</p>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Total Future Maturity Corpus</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1">
                  ₹ {formatINR(ciTotalAmount, 2)}
                </div>

                <div className="mt-6 space-y-3 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Initial Principal:</span>
                    <span className="font-mono font-bold text-[#172554]">₹ {formatINR(ciPrincipal, 2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-950">Compound Interest Earned:</span>
                    <span className="font-mono text-emerald-700">+ ₹ {formatINR(ciInterestEarned, 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. DISCOUNT CALCULATOR */}
        {activeCalc === 'discount' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Original Retail Price (₹)</label>
                <input
                  type="number"
                  value={discountOriginal}
                  onChange={(e) => setDiscountOriginal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Primary Discount (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Extra Coupon (%)</label>
                  <input
                    type="number"
                    value={additionalCouponPercent}
                    onChange={(e) => setAdditionalCouponPercent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Final Discounted Price</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1">
                  ₹ {formatINR(finalDiscountedPrice, 2)}
                </div>

                <div className="mt-6 space-y-2.5 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Original Price:</span>
                    <span className="line-through text-slate-400 font-mono">₹ {formatINR(discountOriginal, 2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Total Money Saved:</span>
                    <span className="font-mono">- ₹ {formatINR(totalDiscountSaved, 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. TAX ESTIMATOR */}
        {activeCalc === 'tax-estimator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Gross Annual Income (₹)</label>
                <input
                  type="number"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Standard Deduction (₹)</label>
                <input
                  type="number"
                  value={standardDeduction}
                  onChange={(e) => setStandardDeduction(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Standard ₹75,000 for salaried employees under New Regime</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Tax calculations are mathematical estimates under simplified New Tax Regime slabs (Section 115BAC). Actual tax liability may differ based on TDS, deductions, or agricultural income.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-3xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Estimated Total Tax Payable (Incl. 4% Cess)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] mt-1">
                  ₹ {formatINR(totalTaxPayable)}
                </div>

                <div className="mt-6 space-y-2.5 pt-4 border-t border-amber-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taxable Net Income:</span>
                    <span className="font-mono font-bold">₹ {formatINR(taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Income Tax:</span>
                    <span className="font-mono font-bold">₹ {formatINR(estimatedTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Health & Education Cess (4%):</span>
                    <span className="font-mono font-bold">₹ {formatINR(healthEduCess)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
