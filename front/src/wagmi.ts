import { Chain } from "@rainbow-me/rainbowkit";
import { createConfig, http } from 'wagmi'


export const ESGI = {
  id: 43112,
  name: "ESGI",
  nativeCurrency: { name: "ESGI", symbol: "ESGI", decimals: 18 },
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
      address: "0xFcDe4c93666f8F05CE08E937Dae7Bd8aC831d3D8",
    },
  },
} as const satisfies Chain;

export const config = createConfig({
  chains: [ESGI],
  transports: {
    [ESGI.id]: http(ESGI.rpcUrls.default.http[0]),
  },
})