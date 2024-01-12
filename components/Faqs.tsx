import React from 'react'
import { AiFillHome } from 'react-icons/ai'
import { BiSupport } from 'react-icons/bi'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import { FaPenNib } from 'react-icons/fa'
import { MdExpandMore } from 'react-icons/md'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

const Faqs = () => {
  return (
    <div className="contain flex flex-col items-start gap-3 pt-36 pb-14">
      <p className="text-sm font-semibold uppercase text-gray-500 md:text-base">
        learn how to get started
      </p>
      <h4 className="text-3xl font-bold text-gray-700">
        Frequently asked questions
      </h4>
      <p className="text-sm font-normal text-gray-500 md:text-base">
        Join Stacks community now to get free updates and also alot of freebies
        are waiting for you or{' '}
        <span className="cursor-pointer font-bold text-blue-500">
          Contact Support
        </span>
      </p>
      <div className="mt-8 flex flex-col gap-24 md:flex-row">
        <div className="hidden flex-col items-start gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <AiFillHome className="text-lg" />
            <p>General</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <BiSupport className="text-lg" />
            <p>Support</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <BsFillLightningChargeFill className="text-lg" />
            <p>Hosting</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <FaPenNib className="text-lg" />
            <p>Product</p>
          </div>
        </div>
        <div>
          <Accordion
            className="text-sm"
            sx={{
              boxShadow: 'none',
              borderTop: '1px solid #EBECED',
              paddingY: '16px',
            }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="text-base font-bold text-gray-600">
                How does it work
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-sm font-normal text-gray-600">
                The Stacks series of products: Stacks: Landing Page Kit, Stacks:
                Portfolio Kit, Stacks: eCommerce Kit. "Stacks is a
                production-ready library of stackable content blocks built in
                React Native. Mix-and-match dozens of responsive elements to
                quickly configure your favorite landing page layouts or hit the
                ground running with 10 pre-built templates, all in light or dark
                mode."
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: 'none',
              borderTop: '1px solid #EBECED',
              paddingY: '16px',
            }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="text-base font-semibold text-gray-600">
                How to start with Stacks
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-sm font-normal text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: 'none',
              borderTop: '1px solid #EBECED',
              paddingY: '16px',
            }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="text-base font-bold text-gray-600">
                Dose it suppoort Dark Mode
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-sm font-normal text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: 'none',
              borderTop: '1px solid #EBECED',
              paddingY: '16px',
            }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="text-base font-bold text-gray-600">
                Does it support Auto-Layout
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-sm font-normal text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              boxShadow: 'none',
              borderTop: '1px solid #EBECED',
              borderBottom: '1px solid #EBECED',
              paddingY: '16px',
            }}
          >
            <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="text-base font-bold text-gray-600">
                What is Stacks Design System
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-sm font-normal text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Faqs
