import { EventInvitationType } from '@event-organizer/shared-types';
import InvitationToAcceptCard from '../events/event-details/invitation-to-accept-card';
import SentInvitationCard from '../events/event-details/sent-invitation-card';

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
          <h2 className={'text-xl font-semibold mb-10'}>Do akceptacji</h2>
          {invitationsToAccept.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'}>
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
      {!!pendingInvitations.length && (
        <div>
          <h2 className={'text-lg font-semibold mb-10'}>Wysłane prośby o dodanie</h2>
          {pendingInvitations.map((i) => (
            <div className={'bg-white p-5 rounded-md shadow'}>
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
