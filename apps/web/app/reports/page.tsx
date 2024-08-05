import { Metadata } from "next";
import { Container } from "@/container";
import Link from "next/link";

export const metadata: Metadata = { title: "Reports" };

export default async function Reports() {
  const cnt = await Container.init({ requireAdmin: true });

  const reports = await cnt.prisma.report.findMany({
    include: {
      reporter: { include: { profile: true } },
      suspect: { include: { profile: true } },
      conversation: true,
      profile: true,
    },
  });

  return (
    <div>
      <h1>Reports</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Reported By</th>
            <th>Reported User</th>
            <th>Conversation</th>
            <th>Profile</th>
            <th>Reason</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.reporter.profile?.name}</td>
              <td>{report.suspect.profile?.name}</td>
              <td>
                <Link href={`/conversations/${report.conversation?.id}`}>
                  {report.conversation?.id}
                </Link>
              </td>
              <td>
                <Link href={`/profiles/${report.profile?.id}`}>
                  {report.profile?.id}
                </Link>
              </td>
              <td>{report.reason}</td>
              <td>{report.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
