import { useRecoilValue } from "recoil";
import { balance } from "../atoms/balance";

export function useBalance() {
    const value = useRecoilValue(balance)

    return value
}