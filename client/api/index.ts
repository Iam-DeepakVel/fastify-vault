import axios from 'axios';

const userBaseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;

const vaultBaseUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/vaults`;

export function registerUser(payload: {
  hashedPassword: string;
  email: string;
}) {
  return axios
    .post<{ salt: string; vault: string }>(userBaseUrl, payload, {
      withCredentials: true,
    })
    .then((res) => res.data);
}

export function loginUser(payload: { hashedPassword: string; email: string }) {
  return axios
    .post<{ salt: string; vault: string }>(`${userBaseUrl}/login`, payload, {
      withCredentials: true,
    })
    .then((res) => res.data);
}

export function saveVault({ encryptedVault }: { encryptedVault: string }) {
  return axios
    .put(
      vaultBaseUrl,
      { encryptedVault },
      {
        withCredentials: true,
      }
    )
    .then((res) => res.data);
}
