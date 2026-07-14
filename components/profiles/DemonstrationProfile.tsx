import { demonstrationProfileNote } from "@/content/site";

export type DemonstrationProfile = {
  id: string;
  label: string;
  age: number;
  location: string;
  profession: string;
  education?: string;
  languages?: string[];
  values: string;
  interests: string;
  peerDescription: string;
  relationshipGoal: string;
};

/**
 * A deliberately modest, clearly fictional example. Do not add wealth or
 * status signalling, and never present a demonstration profile as an
 * active member.
 */
const demonstrationProfile: DemonstrationProfile = {
  id: "demo-1",
  label: "Demonstration profile",
  age: 34,
  location: "Greater Manchester",
  profession: "Secondary school teacher",
  languages: ["English", "conversational Spanish"],
  values:
    "Family close by, honesty over politeness, and a quiet weekend done well. Faith matters to them; kindness matters more.",
  interests:
    "Sunday walks, five-a-side football, slow cooking, and a long-running book club they keep almost quitting.",
  peerDescription:
    "The steady one — the friend who remembers your news and turns up when they said they would.",
  relationshipGoal:
    "A long-term partnership heading toward a shared home and, in time, a family."
};

export function DemonstrationProfileSection() {
  const profile = demonstrationProfile;

  return (
    <section className="section section-deep">
      <div className="wrap split reverse">
        <div>
          <p className="eyebrow">What an introduction looks like</p>
          <h2>A profile that is read, not browsed.</h2>
          <div className="prose" style={{ marginTop: 22 }}>
            <p>
              There is no public grid of faces. When we believe two members are genuinely
              compatible, each privately receives a considered profile of the other — written
              in plain language, approved by its owner, and shared for that introduction only.
            </p>
            <p>
              Here is the kind of thing a member might receive. It is a fictional example,
              not a real person.
            </p>
          </div>
        </div>
        <div>
          <p className="demo-note">{demonstrationProfileNote}</p>
          <article className="profile-sheet" aria-label="Fictional demonstration profile">
            <p className="profile-name">{profile.label}</p>
            <p className="profile-meta">
              {profile.age} · {profile.location}
            </p>
            <dl>
              <div>
                <dt>Profession</dt>
                <dd>{profile.profession}</dd>
              </div>
              {profile.languages ? (
                <div>
                  <dt>Languages</dt>
                  <dd>{profile.languages.join(", ")}</dd>
                </div>
              ) : null}
              <div>
                <dt>Values</dt>
                <dd>{profile.values}</dd>
              </div>
              <div>
                <dt>Interests</dt>
                <dd>{profile.interests}</dd>
              </div>
              <div>
                <dt>How friends describe them</dt>
                <dd>{profile.peerDescription}</dd>
              </div>
              <div>
                <dt>What they are looking for</dt>
                <dd>{profile.relationshipGoal}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
