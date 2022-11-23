import { EventInvitationType } from '@event-organizer/shared-types';
import InvitationToAcceptCard from '../events/event-details/invitation-to-accept-card';
import SentInvitationCard from '../events/event-details/sent-invitation-card';

interface UserProfileInvitationsSectionProps {
  userEventInvitations: EventInvitationType[];
  userEventPendingRequests: EventInvitationType[];
}

const UserProfileInvitationsSection = ({
  userEventInvitations,
  userEventPendingRequests,
}: UserProfileInvitationsSectionProps) => {
  return (
    <>
      {userEventInvitations.length > 0 && (
        <div>
          <h2 className={'text-xl font-semibold mb-10'}>Do akceptacji</h2>
          {userEventInvitations.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'} key={i.id}>
              <InvitationToAcceptCard
                key={i.id}
                image={i.event.bannerImage}
                name={i.event.name}
                eventId={i.event.id}
                invitationId={i.id}
              />
            </div>
          ))}
        </div>
      )}
      {userEventPendingRequests.length > 0 && (
        <div>
          <h2 className={'text-lg font-semibold mb-10'}>Wysłane prośby o dodanie</h2>
          {userEventPendingRequests.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'} key={i.id}>
              <SentInvitationCard
                key={i.id}
                image={i.event.bannerImage}
                name={i.event.name}
                eventId={i.event.id}
                invitationId={i.id}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserProfileInvitationsSection;
