export interface MemberBirthday {
    id: number;
    name: string;
    position: string;
    mobile: string;
    birth_date: string;
    birth_year?: number | null;
    photo_url?: string | null;
    address?: string | null;
    notes?: string | null;
}

export interface MemberWithDaysLeft extends MemberBirthday {
    daysLeft: number;
    nextBirthday: Date;
}

/**
 * Calculate days until next birthday using only month+day.
 * Returns 0 if birthday is today.
 */
export function getDaysUntilBirthday(birthDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisYear = today.getFullYear();

    const nextBirthday = new Date(
        thisYear,
        birthDate.getMonth(),
        birthDate.getDate()
    );
    nextBirthday.setHours(0, 0, 0, 0);

    // If birthday already passed this year, check next year
    if (nextBirthday < today) {
        nextBirthday.setFullYear(thisYear + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Filter members with birthdays in the next N days (default 6).
 * Returns sorted by daysLeft ascending.
 */
export function getUpcomingBirthdays(
    members: MemberBirthday[],
    days: number = 6
): MemberWithDaysLeft[] {
    return members
        .map((m) => {
            const bd = new Date(m.birth_date);
            const daysLeft = getDaysUntilBirthday(bd);
            const thisYear = new Date().getFullYear();
            const nextBirthday = new Date(thisYear, bd.getMonth(), bd.getDate());
            if (nextBirthday < new Date()) {
                nextBirthday.setFullYear(thisYear + 1);
            }
            return { ...m, daysLeft, nextBirthday };
        })
        .filter((m) => m.daysLeft <= days && m.daysLeft >= 0)
        .sort((a, b) => a.daysLeft - b.daysLeft);
}

/**
 * Get members whose birthday is today.
 */
export function getTodayBirthdays(members: MemberBirthday[]): MemberWithDaysLeft[] {
    return getUpcomingBirthdays(members, 365).filter((m) => m.daysLeft === 0);
}

/**
 * Get members by birth month (1-12).
 */
export function getMembersByMonth(
    members: MemberBirthday[],
    month: number
): MemberBirthday[] {
    return members
        .filter((m) => {
            const bd = new Date(m.birth_date);
            return bd.getMonth() + 1 === month;
        })
        .sort((a, b) => {
            const da = new Date(a.birth_date).getDate();
            const db = new Date(b.birth_date).getDate();
            return da - db;
        });
}

/**
 * Get color class for birthday card based on days remaining.
 */
export function getBirthdayColor(daysLeft: number): {
    border: string;
    badge: string;
    bg: string;
    text: string;
} {
    switch (daysLeft) {
        case 0:
            return {
                border: 'border-amber-400',
                badge: 'bg-amber-500/20 text-amber-400',
                bg: 'bg-amber-500/5',
                text: 'text-amber-400',
            };
        case 1:
            return {
                border: 'border-red-500',
                badge: 'bg-red-500/20 text-red-400',
                bg: 'bg-red-500/5',
                text: 'text-red-400',
            };
        case 2:
            return {
                border: 'border-orange-500',
                badge: 'bg-orange-500/20 text-orange-400',
                bg: 'bg-orange-500/5',
                text: 'text-orange-400',
            };
        case 3:
            return {
                border: 'border-yellow-500',
                badge: 'bg-yellow-500/20 text-yellow-400',
                bg: 'bg-yellow-500/5',
                text: 'text-yellow-400',
            };
        case 4:
            return {
                border: 'border-blue-500',
                badge: 'bg-blue-500/20 text-blue-400',
                bg: 'bg-blue-500/5',
                text: 'text-blue-400',
            };
        case 5:
            return {
                border: 'border-teal-500',
                badge: 'bg-teal-500/20 text-teal-400',
                bg: 'bg-teal-500/5',
                text: 'text-teal-400',
            };
        default:
            return {
                border: 'border-slate-200',
                badge: 'bg-white/10 text-slate-600',
                bg: 'bg-white/[0.02]',
                text: 'text-slate-600',
            };
    }
}
