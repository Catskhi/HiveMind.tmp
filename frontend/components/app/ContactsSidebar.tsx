"use client";

import FormTextInput from "../forms/FormTextInput";

type Contact = {
  id: string;
  name: string;
  status: 'online' | 'offline';
  unread: number;
  keyValid: boolean;
};

interface Props {
    className?: string
}

export default function ContactsSidebar({className}: Props) {
    return (
        <div className={className + ' w-64 border-[#9b9b9b]'}>
            <div className="px-4 mt-4">
                <FormTextInput placeholder="Search... " className="border-[1px] p-2" />
            </div>
        </div>
    )
}