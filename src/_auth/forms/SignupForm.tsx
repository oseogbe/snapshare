import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { SignupSchema } from "@/lib/validation";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const SignupForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount()
    const { mutateAsync: signInAccount } = useSignInAccount()
    const { checkAuthUser } = useUserContext()

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SignupSchema>) {

        try {
            const newUser = await createUserAccount(values)

            if (!newUser) throw Error

            const session = await signInAccount({ email: values.email, password: values.password })

            if (!session) throw Error

            const isLoggedIn = await checkAuthUser()

            if (!isLoggedIn) throw Error

            form.reset()
            navigate('/')
        } catch (error) {
            console.log(error)
            return toast({
                variant: 'destructive',
                title: 'Sign up failed. Please try again!',
            })
        }
    }

    return (
        <Form {...form}>
            <div className="min-w-[290px] sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Create a new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use SnapShare, please enter your details
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary" disabled={isCreatingUser}>
                        {
                            isCreatingUser ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                </div>
                            ) : "Sign Up"
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Already have an account?
                        <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignupForm;
