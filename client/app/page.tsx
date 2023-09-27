'use client';
import LoginForm from '@/components/login-form';
import RegisterForm from '@/components/register-form';
import Vault from '@/components/vault';
import { useState, useEffect } from 'react';

export type Step = 'login' | 'register' | 'vault';

export interface VaultItem {
  website: string;
  username: string;
  password: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>('login');
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [vaultKey, setVaultKey] = useState('');

  useEffect(() => {
    const vault = window.sessionStorage.getItem('vault');
    const vaultKey = window.sessionStorage.getItem('vault_key');
    if (vault) {
      setVault(JSON.parse(vault));
    }
    if (vaultKey) {
      setVaultKey(JSON.parse(vaultKey));
      setStep('vault');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {step === 'register' && (
        <RegisterForm setStep={setStep} setVaultKey={setVaultKey} />
      )}
      {step === 'login' && (
        <LoginForm
          setVault={setVault}
          setStep={setStep}
          setVaultKey={setVaultKey}
        />
      )}
      {step === 'vault' && <Vault vault={vault} vaultKey={vaultKey} />}
    </div>
  );
}
