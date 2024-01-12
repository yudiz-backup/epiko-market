import * as React from 'react'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

const PrettoSlider = styled(Slider)({
  color: 'transparent',
  borderRadius: '100px',
  height: '50px',
  padding: 0,
  '& .MuiSlider-track': {
    border: 'none',
    height: '50px',
    color: '#38DEFF',
  },
  '&:after': {
    width: '100%',
    height: '50px',
    backgroundColor: 'red',
  },
  '& .MuiSlider-thumb': {
    height: 32,
    width: 32,
    backgroundColor: '#38DEFF',
    border: '6px solid #fff',
    zIndex: 20,
    boxShadow:
      '12.5px 12.5px 10px rgba(0, 0, 0, 0.025) 100px 100px 80px rgba(0, 0, 0, 0.05)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    // padding: 0,
    // width: 40,
    // height: 30,
    padding: '10px 16px',
    borderRadius: '10px',
    backgroundColor: '#141416',
    // transformOrigin: 'bottom left',
    // transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    // '&:before': { display: 'none' },
    // '&.MuiSlider-valueLabelOpen': {
    //   transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    // },
    // '& > *': {
    //   transform: 'rotate(45deg)',
    // },
  },
})

export default function SliderCustom() {
  function valueLabelFormat(value) {
    const USD = '$'
    let scaledValue = value

    return `${USD}${scaledValue}`
  }

  return (
    <PrettoSlider
      valueLabelDisplay="auto"
      aria-label="pretto slider"
      defaultValue={50}
      className="range-slider"
      getAriaValueText={valueLabelFormat}
      valueLabelFormat={valueLabelFormat}
    />
  )
}
