import Link from "next/link";
import Image from "next/image";
import Badge from "./components/Badge";
import ArrowIcon from "./components/ArrowIcon";
import type { Metadata } from "next";
import Separator from "./components/separator";
import GitHubCalendar from "react-github-calendar";
import { config } from "./config/config";
import ExperienceCounter from "./components/experience-counter";

export const metadata: Metadata = {
	metadataBase: new URL("https://ayushchugh.com"),
	title: "Gourav Chaudhary",
	description:
		"I'm a Full Stack Web Developer from India, trying to make the internet a bit cooler one website at a time.",
	keywords: [
		"Gourav Chaudhary",
		"Full Stack Developer",
		"Web Developer",
		"React Developer",
		"Next.js Developer",
		"TypeScript Developer",
		"Node.js Developer",
		"Software Engineer",
		"India Developer",
		"Mohali Developer",
	],
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Gourav Chaudhary",
		description:
			"I'm a Full Stack Web Developer from India, trying to make the internet a bit cooler one website at a time.",
		url: "https://ayushchugh.com",
		siteName: "Gourav Chaudhary's Portfolio",
		images: [
			{
				url: "https://cdn.ayushchugh.com/open-graph/business-card.png",
				height: 630,
				alt: "Ayush Chugh",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Gourav Chaudhary",
		description:
			"I'm a Full Stack Web Developer from India, trying to make the internet a bit cooler one website at a time.",
		images: ["https://cdn.ayushchugh.com/open-graph/business-card.png"],
		creator: "@Gouravv_c",
		creatorId: "@Gouravv_c",
		site: "@Gouravv_c",
		siteId: "@Gouravv_c",
	},
};

export default function Page() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Gourav Chaudhary",
		url: "https://ayushchugh.com",
		image: "https://cdn.ayushchugh.com/open-graph/business-card.png",
		jobTitle: "Full Stack Web Developer",
		worksFor: [
			{
				"@type": "Organization",
				name: "Ravix Studio",
				url: config.companies.ravixStudio,
			},
			{
				"@type": "Organization",
				name: "Avenue Ticketing",
				url: config.companies.avenueTicketing,
			},
		],
		sameAs: [
			config.socials.github,
			config.socials.twitter,
			config.socials.linkedin,
		],
		knowsAbout: [
			"Full Stack Development",
			"React",
			"Next.js",
			"TypeScript",
			"Node.js",
			"Web Development",
		],
		address: {
			"@type": "PostalAddress",
			addressLocality: "Mohali",
			addressCountry: "India",
		},
	};

	return (
		<section>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<header className="mb-6">
				<div className="flex items-center gap-3 mb-2 flex-wrap">
					<h1 className='font-medium text-2xl tracking-tight font-["monospace"]'>
						Sup, I'm Gourav Chaudhary 👋
					</h1>
					{config.profile.availableForFreelance && (
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
							</span>
							Available for freelance
						</span>
					)}
				</div>
				<p className="text-lg prose prose-neutral dark:prose-invert">
					I'm a Full Stack Web Developer from Kangra, India, with{" "}
					<ExperienceCounter />, trying to make the internet a bit cooler one
					website at a time.
				</p>
			</header>

			<Separator />

			<div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>Professional Work</h2>
				<p>
					I build digital experiences that matter. Recently, as a{" "}
					<strong>Frontend Developer Trainee</strong> at{" "}
					<span className="not-prose">
						<Badge href={config.companies.GokboruTech}>
							<Image
								src={"/gokboru.png"}
								alt="Gokboru Tech"
								height={20}
								width={20}
								className={"pr-1"}
							/>
							Gokboru Tech
						</Badge>
					</span>{" "}
					, I didn't just write code—I engineered high-performance full-stack
					solutions using the MERN stack (React.js, Node.js, MongoDB).
				</p>
				<p>
					I architected lightning-fast React interfaces and robust RESTful APIs,
					optimizing every millisecond to slash load times while deploying
					scalable MongoDB schemas. From crushing Agile sprints to mastering
					modern JavaScript (ES6+), I focused on shipping production-level code
					that’s as efficient as it is elegant. Want the full deep dive? Check out
					my <Link href="/resume">resume</Link>.
				</p>
			</div>

			<Separator />

			<div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>What Makes Me Different</h2>
				<p>
					I’m not just a developer—I’m a product builder. My radical ownership of
					outcomes is what fast-tracked me to become the youngest Team Lead in my
					previous role. I bridge the gap between complex engineering and
					business goals, because I know that clean code implies nothing if it
					doesn't solve real-world problems.
				</p>
				<p>
					I don't just use AI; I master it. I treat AI as a force multiplier to
					architect robust systems at breakneck speeds, fusing 10x velocity with
					human architectural rigor. I build fast, break nothing, and ship
					quality features that stand the test of scale.
				</p>
			</div>

			<Separator />

			{/* <div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>Leadership & Community</h2>
				<p>
					As the Team Lead at the Innovation Club of{" "}
					<a href="https://ccetdiploma.edu.in/" target="_blank">
						CCET College
					</a>
					, I've learned how to lead a team and stay organized. I also assist in{" "}
					<a href="https://chdtechnicaleducation.gov.in/" target="_blank">
						ICT
					</a>{" "}
					training sessions, teaching government employees essential computer
					skills. Additionally, I help organize the <i>Talent Hunt</i> cultural
					program and serve as the student coordinator for <i>Jhalak</i>, our
					college's digital newsletter.
				</p>
			</div>

			<Separator /> */}

			{/* <div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>Personal Interests</h2>
				<p>
					Outside of work, I enjoy exploring Vedic astrology, playing the
					guitar, and spending time with friends. I'm also pursuing a diploma in
					Computer Science Engineering (CSE).
				</p>
			</div>

			<Separator /> */}

			<div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>GitHub Contributions</h2>
				<GitHubCalendar username="GouravSittam" />
			</div>

			<Separator />

			<div className="mb-8 prose prose-neutral dark:prose-invert">
				<h2>Writing</h2>
				<p>
					I've started writing <Link href="/blog">blogs</Link> to help others
					improve their engineering skills. Stay tuned for more content!
				</p>
			</div>

			<div className="prose prose-neutral dark:prose-invert">
				<article className="text-xs sm:hidden lg:block">
					Press ⌘+K to navigate with your keyboard.
				</article>
			</div>

			<ul className="flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-600 dark:text-neutral-300">
				{/* <li>
					<Link
						className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
						href={config.socials.community}
					>
						<ArrowIcon />
						<p className="h-7 ml-2">Join my community</p>
					</Link>
				</li> */}
				<li>
					<a
						className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all"
						rel="noopener noreferrer"
						target="_blank"
						href={config.socials.twitter}
					>
						<ArrowIcon />
						<p className="h-7 ml-2">Follow me</p>
					</a>
				</li>
			</ul>

			<div>
				<a
					className="flex items-center hover:text-neutral-800 dark:hover:text-neutral-100 transition-all text-neutral-600 dark:text-neutral-300 mt-3"
					rel="noopener noreferrer"
					target="_blank"
					href={`mailto:${config.socials.email}?subject=Hello Ayush!`}
				>
					<p className="h-7">
						<span className="mr-2 text-neutral-600">📧</span>
						{config.socials.email}
					</p>
				</a>
			</div>
		</section>
	);
}
