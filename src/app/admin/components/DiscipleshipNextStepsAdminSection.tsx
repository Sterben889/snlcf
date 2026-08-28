/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { updateDiscipleshipNextSteps } from "~/app/admin/actions";
import { getSiteContent } from "~/server/site-content";

export async function DiscipleshipNextStepsAdminSection() {
  const content = await getSiteContent();

  return (
    <>
      <div className="my-12 border-t border-gray-200" />

      <section id="discipleship-next-steps-editor" className="scroll-mt-6">
        <div>
          <h2 className="text-2xl font-bold">Discipleship — Next Steps</h2>

          <p className="mt-2 text-gray-600">
            Edit the three fixed next-step cards and their contact information.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            These cards cannot be added or removed.
          </p>
        </div>

        <form action={updateDiscipleshipNextSteps} className="mt-8 space-y-10">
          {/* Main section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Section heading</h3>

            <div>
              <label className="mb-2 block font-semibold">Small heading</label>

              <input
                name="discipleshipNextEyebrow"
                required
                defaultValue={content.discipleshipNextEyebrow}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Main title</label>

              <textarea
                name="discipleshipNextTitle"
                required
                rows={3}
                defaultValue={content.discipleshipNextTitle}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <CardEditor
            number={1}
            eyebrow={content.discipleshipCard1Eyebrow}
            title={content.discipleshipCard1Title}
            body={content.discipleshipCard1Body}
            contact={content.discipleshipCard1Contact}
            email={content.discipleshipCard1Email}
            phone={content.discipleshipCard1Phone}
          />

          <CardEditor
            number={2}
            eyebrow={content.discipleshipCard2Eyebrow}
            title={content.discipleshipCard2Title}
            body={content.discipleshipCard2Body}
            contact={content.discipleshipCard2Contact}
            email={content.discipleshipCard2Email}
            phone={content.discipleshipCard2Phone}
          />

          <CardEditor
            number={3}
            eyebrow={content.discipleshipCard3Eyebrow}
            title={content.discipleshipCard3Title}
            body={content.discipleshipCard3Body}
            contact={content.discipleshipCard3Contact}
            email={content.discipleshipCard3Email}
            phone={content.discipleshipCard3Phone}
          />

          <button
            type="submit"
            className="rounded-md bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Next Steps section
          </button>
        </form>
      </section>
    </>
  );
}

type CardEditorProps = {
  number: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  body: string;
  contact: string;
  email: string;
  phone: string;
};

function CardEditor({
  number,
  eyebrow,
  title,
  body,
  contact,
  email,
  phone,
}: CardEditorProps) {
  const prefix = `discipleshipCard${number}`;

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="text-xl font-bold">Card {number}</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold">Small heading</label>

          <input
            name={`${prefix}Eyebrow`}
            required
            defaultValue={eyebrow}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Card title</label>

          <input
            name={`${prefix}Title`}
            required
            defaultValue={title}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-semibold">Description</label>

        <textarea
          name={`${prefix}Body`}
          required
          rows={7}
          defaultValue={body}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-bold">Contact information</h4>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-semibold">Contact person</label>

            <input
              name={`${prefix}Contact`}
              required
              defaultValue={contact}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Email</label>

            <input
              name={`${prefix}Email`}
              type="email"
              required
              defaultValue={email}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Phone</label>

            <input
              name={`${prefix}Phone`}
              type="tel"
              required
              defaultValue={phone}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
