/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from '@/context/AuthContext';
import useAxios from '@/hooks/useAxios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Admin } from '../type';
// import Image from 'next/image';
import toast from "react-hot-toast";
import Loader from '@/components/common/Loader';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function AdminProfile() {
  const { adminId } = useParams();
  const { authToken } = useAuth();

  // STATE
  const [admin, setAdmin] = useState<Admin>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmin = async () => {
    setIsLoading(true);

    try {
      const res = await useAxios.get(`/user/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setAdmin(res.data.admin);
    } catch (err: any) {
      setError(err.response?.data?.message);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchAdmin()
    }
  }, [authToken])

  return (
    <div>
      <PageBreadcrumb />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Admin profile
        </h3>
        {isLoading ? <Loader text='Load content' /> :
          <div className="space-y-6">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                  {/* <Image
                    width={80}
                    height={80}
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${data.logo_path}`}
                    alt={data.name}
                    className='rounded-full w-20 h-20'
                  /> */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                      Information
                    </h4>

                    <div className='flex flex-col gap-10'>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Admin Name
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {admin?.name}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {admin?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            {/* <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    Information
                  </h4>

                  <div className='flex flex-col gap-10'>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                      <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          admin Name
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {data.name}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Acronim
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {data.acronim}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Description
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {data.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                      <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Admin Name
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {data.user?.name}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                          Admin Email
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {data.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        }
      </div>
    </div>
  );
}
