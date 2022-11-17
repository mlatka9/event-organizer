import { EventInvitationType } from '@event-organizer/shared-types';
import InvitationToAcceptCard from '../event/event-pending-invitation-modal/invitation-to-accept-card';
import SentInvitationCard from '../event/event-pending-invitation-modal/sent-invitation-card';

interface UserProfileInvitationsSectionProps {
  userEventInvitations: EventInvitationType[];
}

const UserProfileInvitationsSection = ({ userEventInvitations }: UserProfileInvitationsSectionProps) => {
  const pendingInvitations = userEventInvitations.filter((i) => !i.isAdminAccepted);
  const invitationsToAccept = userEventInvitations.filter((i) => !i.isUserAccepted);

  console.log(userEventInvitations);

  return (
    <>
      {!!invitationsToAccept.length && (
        <div>
          <h2 className={'text-lg font-semibold mb-10'}>Do akceptacji</h2>
          {invitationsToAccept.map((i) => (
            <InvitationToAcceptCard
              key={i.id}
              image={i.event.bannerImage}
              name={i.event.name}
              eventId={i.event.id}
              invitationId={i.id}
            />
          ))}
        </div>
      )}
      {!!pendingInvitations.length && (
        <div>
          <h2 className={'text-lg font-semibold mb-10'}>Wysłane prośby o dodanie</h2>
          {pendingInvitations.map((i) => (
            <SentInvitationCard
              key={i.id}
              image={i.event.bannerImage}
              name={i.event.name}
              eventId={i.event.id}
              invitationId={i.id}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default UserProfileInvitationsSection;
