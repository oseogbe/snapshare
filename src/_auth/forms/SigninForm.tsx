import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { SigninSchema } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
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

const SigninForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { mutateAsync: signInAccount } = useSignInAccount()
    const { checkAuthUser, isLoading } = useUserContext()

    const form = useForm<z.infer<typeof SigninSchema>>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SigninSchema>) {

        try {
            const session = await signInAccount({ email: values.email, password: values.password })

            if (!session) throw Error("Incorrect email or password. Please try again.")

            const isLoggedIn = await checkAuthUser()

            if (!isLoggedIn) throw Error()

            form.reset()
            navigate('/')
        } catch (error) {
            console.log(error)
            const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again!'
            return toast({
                title: errorMessage,
                variant: 'destructive',
            })
        }
    }

    return (
        <Form {...form}>
            <div className="min-w-[290px] sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Welcome back
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use SnapShare, please enter your details
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
                    <Button type="submit" className="shad-button_primary" disabled={isLoading}>
                        {
                            isLoading ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                </div>
                            ) : "Sign In"
                        }
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account?
                        <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SigninForm;
