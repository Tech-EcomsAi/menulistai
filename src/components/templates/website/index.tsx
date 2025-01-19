'use client';

import { Button } from 'antd';
import { motion } from 'framer-motion';
import { BiBrain, BiRestaurant, BiSupport } from 'react-icons/bi';
import { MdOutlineAutoGraph } from 'react-icons/md';
import GetStartedButton from './getStartedButton';
import styles from './website.module.scss';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 }
    }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

function Website() {
    return (
        <div className={styles.websiteContainer}>
            <motion.div
                className={styles.hero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Revolutionize Your Restaurant with AI</h1>
                <p>
                    MenulistAI transforms your restaurant operations with advanced AI technology.
                    From menu optimization to customer insights, {"we're"} your partner in culinary excellence.
                </p>
                <GetStartedButton />
            </motion.div>

            <div className={styles.features}>
                <motion.div className={styles.featureGrid} variants={stagger} initial="initial" animate="animate">
                    {[
                        {
                            icon: <BiBrain />,
                            title: "Smart Menu Analysis",
                            description: "Our AI analyzes your menu performance and suggests optimizations to maximize profitability."
                        },
                        {
                            icon: <BiRestaurant />,
                            title: "Restaurant Operations",
                            description: "Streamline your operations with AI-powered inventory management and staff scheduling."
                        },
                        {
                            icon: <MdOutlineAutoGraph />,
                            title: "Performance Insights",
                            description: "Get detailed analytics and insights about your restaurant's performance and customer preferences."
                        },
                        {
                            icon: <BiSupport />,
                            title: "24/7 Support",
                            description: "Our dedicated support team is always available to help you make the most of MenulistAI."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.featureCard}
                            variants={fadeInUp}
                        >
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className={styles.capabilities}
                initial="initial"
                animate="animate"
                variants={stagger}
            >
                <h2>Advanced Capabilities</h2>
                {[
                    {
                        title: "Menu Optimization",
                        description: "Our AI analyzes customer preferences, seasonal trends, and pricing strategies to help you create the perfect menu that maximizes both satisfaction and profits.",
                        image: "https://placehold.co/600x400/000000/808080/png?text=Menu+Optimization"
                    },
                    {
                        title: "Staff Management",
                        description: "Intelligent scheduling and performance tracking help you manage your team effectively, ensuring optimal staffing levels during peak hours.",
                        image: "https://placehold.co/600x400/000000/808080/png?text=Staff+Management"
                    },
                    {
                        title: "Customer Analytics",
                        description: "Gain deep insights into customer behavior, preferences, and ordering patterns to make data-driven decisions that grow your business.",
                        image: "https://placehold.co/600x400/000000/808080/png?text=Customer+Analytics"
                    }
                ].map((capability, index) => (
                    <motion.div key={index} className={styles.capabilityItem} variants={fadeInUp}>
                        <div className={styles.content}>
                            <h3>{capability.title}</h3>
                            <p>{capability.description}</p>
                        </div>
                        <div className={styles.image}>
                            <img src={capability.image} alt={capability.title} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className={styles.demoSection}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>See MenulistAI in Action</h2>
                <div className={styles.demoVideo}>
                    <img
                        src="https://placehold.co/1000x562/000000/808080/png?text=MenulistAI+Demo"
                        alt="MenulistAI Demo"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            </motion.div>

            <motion.div
                className={styles.cta}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Ready to Transform Your Restaurant?</h2>
                <p>Join thousands of restaurants already using MenulistAI to optimize their operations and increase profits.</p>
                <Button type="primary" size="large" href="/signin">
                    Start Free Trial
                </Button>
            </motion.div>
        </div>
    );
}

export default Website;