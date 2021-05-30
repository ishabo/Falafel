import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getBlocks } from '../../services/blocks';
import { Block as BlockType } from '../../services/blocks/types';
import Block from '../Block'
import Layout from '../Layout'

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const BlockTitle: React.FC<{block: BlockType, order: number}> = ({block, order }) => {
  const classes = useStyles();
  let title = `${block.lastHash.substring(0, 32)} <- ${block.hash.substring(0, 32)}...`
  if (order === 1) {
    title = 'The Gensis'
  } else if (order === 2) {
    title = `Genesis Hash <- ${block.hash.substring(0, 32)}...`
  }

  return (<Typography className={classes.heading}>{title}</Typography>)
}

const Blocks = () => {
  const [blocks, setBlocks] = React.useState<BlockType[]>([]);
  const [expanded, setExpanded] = React.useState<string | undefined>(undefined);


  React.useEffect(() => {
    (async () => {
      const info = await getBlocks();
      if (info) {
        setBlocks(info)
      }
    })()
  }, [])

  const handleChange = (panel: string) => (e: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : undefined);
  }

  return (
    <Layout title="Blocks">
        {blocks && blocks.map((block, index) => (
          <Accordion key={block.hash} expanded={expanded === block.hash} onChange={handleChange(block.hash)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${block.hash}-content`}
              id={`${block.hash}-header`}
            >
            <BlockTitle block={block} order={index + 1} />
            </AccordionSummary>
            <AccordionDetails>
              <Block key={block.hash} block={block}/>
            </AccordionDetails>
          </Accordion>
          ))}
    </Layout>
  );
}

export default Blocks;

