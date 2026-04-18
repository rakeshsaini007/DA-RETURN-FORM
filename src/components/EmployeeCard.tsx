import React from 'react';
import { motion } from 'motion/react';
import { User, Building2, Briefcase, Hash, CreditCard, Landmark, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Employee {
  ehrmsCode: string;
  employeeName: string;
  designation: string;
  schoolName: string;
  accountNumber: string;
  ifscCode: string;
  isFilled: boolean;
}

interface EmployeeCardProps {
  employee: Employee;
  formData: {
    accountNumber: string;
    ifscCode: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errors: {
    accountNumber?: string;
    ifscCode?: string;
  };
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  formData,
  onFormChange,
  onSubmit,
  isLoading,
  errors
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-6 md:p-8 max-w-2xl mx-auto mt-8 w-full"
    >
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-100 pb-6">
        <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{employee.employeeName}</h2>
          <p className="text-neutral-500 font-mono text-sm">EHRMS: {employee.ehrmsCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Briefcase size={12} /> Designation
          </label>
          <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-700 font-medium">
            {employee.designation}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Building2 size={12} /> School Name
          </label>
          <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-700 font-medium">
            {employee.schoolName}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="accountNumber" className="text-sm font-semibold flex items-center gap-2">
            <CreditCard size={16} /> Salary Account Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="accountNumber"
              readOnly
              className="input-field pr-10 bg-neutral-50 cursor-default"
              value={formData.accountNumber || "Not Provided"}
            />
            {formData.accountNumber ? (
              <CheckCircle2 className="absolute right-3 top-3.5 text-green-500" size={18} />
            ) : (
              <AlertCircle className="absolute right-3 top-3.5 text-neutral-300" size={18} />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="ifscCode" className="text-sm font-semibold flex items-center gap-2">
            <Landmark size={16} /> IFSC CODE
          </label>
          <div className="relative">
            <input
              type="text"
              id="ifscCode"
              readOnly
              className="input-field uppercase pr-10 font-mono bg-neutral-50 cursor-default"
              value={formData.ifscCode || "Not Provided"}
            />
            {formData.ifscCode ? (
              <CheckCircle2 className="absolute right-3 top-3.5 text-green-500" size={18} />
            ) : (
              <AlertCircle className="absolute right-3 top-3.5 text-neutral-300" size={18} />
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-400 font-medium italic">Data fetched from master records - View Only Mode</p>
        </div>
      </div>
    </motion.div>
  );
};
