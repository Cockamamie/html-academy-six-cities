import {JSX} from 'react';
import Map from '../main/map.tsx';
import CardsList from '../main/cards-list.tsx';
import {useAppDispatch, useAppSelector} from '../../hooks';
import OfferGallery from './offer-gallery.tsx';
import {useParams} from 'react-router-dom';
import {fetchOfferAction, fetchOffersNearbyAction, fetchReviewsAction} from '../../store/api-actions.ts';
import Spinner from '../on-load/spinner.tsx';
import {getOffer, getOffersNearby, isOfferPageDataLoading} from '../../store/app-data/selectors.ts';
import OfferContainer from './offer-container.tsx';

export default function OfferPage(): JSX.Element {
  const params = useParams();
  const id = params.id!;

  const dispatch = useAppDispatch();
  const offer = useAppSelector(getOffer);
  const offersNearby = useAppSelector(getOffersNearby);
  const isLoading = useAppSelector(isOfferPageDataLoading);

  if (offer === undefined || offer.id !== id) {
    dispatch(fetchOfferAction(id));
    dispatch(fetchOffersNearbyAction(id));
    dispatch(fetchReviewsAction(id));
  }

  if (!offer || isLoading) {
    return <Spinner />;
  }

  const points = offersNearby.map((card) => card.location).concat(offer.location);

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          {<OfferGallery images={offer.images.slice(0, 6)}/>}
          <OfferContainer offer={offer}/>
          <Map
            city={offer.city}
            points={points}
            selectedPoint={offer.location}
            mapClass={'offer__map map'}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <CardsList
              cards={offersNearby}
              onListItemHover={() => null}
              listClassNames={'near-places__list places__list'}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
