import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import OnSale from './OnSale'
import Created from './Created'
import Liked from './Liked'
import Collectibles from './Collectibles'
import Activity from './Activity'
import Following from './Following'
import Followers from './Followers'
// import { UserContext } from '../../context/context'
import axios from 'axios'
import { headers } from '../../next.config'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'
import { Container } from '@mui/material'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles({
  title: {
    color: '#707070',
    '&:active, &:selected': {
      color: '#000000',
      fontWeight: 'bold',
      borderColor: '#c0f0f8',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#38DEFF',
    },
  },

  epikoTabs: {
    color: '#707070',
    '& .Mui-selected': {
      color: '#000000',
      fontWeight: 'bold',
      borderColor: '#c0f0f8',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#38DEFF',
    },
  },
})

export default function BasicTabs({
  user,
  createdNft,
  followers,
  following,
  liked,
}) {
  const [value, setValue] = React.useState(0)

  const token = localStorage.getItem('auth_pass')

  const [{ onSaleNft }, dispatch] = useStateValue()

  const classes = useStyles()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 0, borderColor: '#c0f0f8' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="basic tabs example"
            className={classes.epikoTabs}
          >
            <Tab label="On sale" className={classes.title} {...a11yProps(0)} />
            <Tab label="Created" className={classes.title} {...a11yProps(1)} />
            <Tab
              label="Collectibles"
              className={classes.title}
              {...a11yProps(2)}
            />
            <Tab label="Liked" className={classes.title} {...a11yProps(3)} />
            <Tab label="Activity" className={classes.title} {...a11yProps(4)} />
            <Tab
              icon={
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#EE8FFF] p-3 text-[10px] text-white">
                  <p>{following ? following?.length : 0}</p>
                </div>
              }
              iconPosition="end"
              label="Following"
              className={classes.title}
              {...a11yProps(5)}
            />
            <Tab
              icon={
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#EE8FFF] p-3 text-[10px] text-white">
                  <p>{followers ? followers?.length : 0}</p>
                </div>
              }
              iconPosition="end"
              label="Followers"
              className={classes.title}
              {...a11yProps(5)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <OnSale user={user} onSale={createdNft} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Created user={user} createdNft={createdNft} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Collectibles user={user} collectibles={createdNft} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Liked liked={liked} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Activity />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Following followings={following} />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Followers followers={followers} />
        </TabPanel>
      </Box>
    </Container>
  )
}
