import AddressIcon from '../../icons/address-icon';
import DateIcon from '../../icons/date-icon';

import LogisticsItem from '../LogisticsItem/LogisticsItem';
import EventLogisticsStyle from './EventLogistics.module.css';

import Image from 'next/image';

const EventLogistics = (props) => {
  const { date, address, image, imageAlt } = props;

  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const addressText = address.replace(', ', '\n');

  return (
    <section className={EventLogisticsStyle.Logistics}>
      <div className={EventLogisticsStyle.Image}>
        <img src={`/${image}`} alt={imageAlt} height={160} width={160} />
      </div>
      <ul className={EventLogisticsStyle.List}>
        <LogisticsItem icon={DateIcon}>
          <time>{humanReadableDate}</time>
        </LogisticsItem>
        <LogisticsItem icon={AddressIcon}>
          <time>{addressText}</time>
        </LogisticsItem>
      </ul>
    </section>
  );
};

export default EventLogistics;
