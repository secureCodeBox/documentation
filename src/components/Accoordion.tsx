import clsx from "clsx";
import React from "react";
import {
  Accordion as AccessibleAccordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import styles from "../css/accordion.module.scss";

export default function Accordion({
  items,
  fullWidth = false,
}: {
  items: { title: string; content: string }[];
  fullWidth?: boolean;
}) {
  return (
    <AccessibleAccordion
      allowZeroExpanded={true}
      allowMultipleExpanded={false}
      className={clsx(styles.accordion, fullWidth ? "" : styles.width80)}
    >
      {items.map((item, i) => (
        <AccordionItem className={styles.accordionItem} key={i}>
          <AccordionItemHeading>
            <AccordionItemButton className={styles.accordionButton}>
              {item.title}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className={styles.accordionPanel}>
            {item.content}
          </AccordionItemPanel>
        </AccordionItem>
      ))}
    </AccessibleAccordion>
  );
}
