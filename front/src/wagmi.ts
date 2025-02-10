import { Chain } from "@rainbow-me/rainbowkit";
import { createConfig, http } from 'wagmi'


export const ESGI = {
  id: 12345,
  name: "esgi",
  nativeCurrency: { name: "ESGI Token", symbol: "ESGI", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        "http://127.0.0.1:59215/ext/bc/HdtpLAv2Nb5nfAmLwGnecEqk3dD3wQc3cpC2wbxoZerFWu2kz/rpc",
      ],
    },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  contracts: {
    ESGICertificates: {
      address: "0x4Ac1d98D9cEF99EC6546dEd4Bd550b0b287aaD6D",
    },
  },
} as const satisfies Chain;

export const config = createConfig({
  chains: [ESGI],
  transports: {
    [ESGI.id]: http(ESGI.rpcUrls.default.http[0]),
  },
})