import WalletIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import CreditCardIcon from '@mui/icons-material/CreditCardRounded'
import HomeIcon from '@mui/icons-material/HomeRounded'
import FastfoodIcon from '@mui/icons-material/FastfoodRounded'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxiRounded'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBusRounded'
import CommuteIcon from '@mui/icons-material/CommuteRounded'
import MovieIcon from '@mui/icons-material/MovieCreationRounded'
import MusicNoteIcon from '@mui/icons-material/MusicNoteRounded'
import LocalMallIcon from '@mui/icons-material/LocalMallRounded'
import OtherHousesIcon from '@mui/icons-material/OtherHousesRounded'
import ApartmentIcon from '@mui/icons-material/ApartmentRounded'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartRounded'
import SavingsIcon from '@mui/icons-material/SavingsRounded'
import RestaurantIcon from '@mui/icons-material/RestaurantRounded'
import AttractionsIcon from '@mui/icons-material/AttractionsRounded'
import ShowChartIcon from '@mui/icons-material/ShowChartRounded'
import PercentIcon from '@mui/icons-material/PercentRounded'
import {JSX} from "react"

const ICON_MAP: Record<string, JSX.Element> = {
  wallet: <WalletIcon />,
  'credit-card': <CreditCardIcon />,
  home: <HomeIcon />,
  food: <FastfoodIcon />,
  taxi: <LocalTaxiIcon />,
  bus: <DirectionsBusIcon />,
  transport: <CommuteIcon />,
  cinema: <MovieIcon />,
  'music-note': <MusicNoteIcon />,
  purchase: <LocalMallIcon />,
  'household-goods': <OtherHousesIcon />,
  apartment: <ApartmentIcon />,
  'shopping-cart': <ShoppingCartIcon />,
  savings: <SavingsIcon />,
  restaurant: <RestaurantIcon />,
  entertainment: <AttractionsIcon />,
  investment: <ShowChartIcon />,
  percent: <PercentIcon />,
}

type Props = {
  name: string
  color: string
}

export function Icon({ name, color }: Props) {
  const Icon = ICON_MAP[name] ?? <WalletIcon />

  return (
    <div
      className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-white"
      style={{ backgroundColor: color }}
    >
      {Icon}
    </div>
  )
}